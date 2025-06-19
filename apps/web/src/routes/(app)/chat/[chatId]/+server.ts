import { appendResponseMessages, streamText, tool } from 'ai';
import { z } from 'zod';
import * as mj from 'mathjs';
import { db } from '$lib/server/db/index.js';
import { threadsTable, usersTable } from 'database/schema';
import { eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/validateSession.js';
import { getModel } from '$lib/server/getModel';

export const POST = async ({ request, params, cookies }) => {
	const userPromise = validateSession(cookies);
	const chatInfoPromise = db.select().from(threadsTable).where(eq(threadsTable.id, params.chatId));
	const requestJsonPromise = request.json();

	const user = await userPromise;
	if (!user) {
		return error(400, {
			message: 'Invalid Session'
		});
	}

	if (user.messagesSent >= user.messageLimit) {
		return error(400, 'Message Limit Reached');
	}

	const chatInfo = await chatInfoPromise;
	if (!chatInfo[0]) {
		return error(404, 'Chat not found');
	}
	const { messages } = await requestJsonPromise;

	const res = streamText({
		maxSteps: 25,
		model: getModel(chatInfo[0].selectedModel),
		messages,
		tools: {
			time: tool({
				description: 'Get current time',
				parameters: z.object({}),
				execute: async () => {
					return {
						time: Date.now().toString()
					};
				}
			}),
			math: tool({
				description:
					'Perform a math calculation. This should be used for any math to ensure accuracy.',
				parameters: z.object({
					expression: z
						.string()
						.describe(
							'The expression to evaluate. Use like: `7 + 8 * 10 + 10 / 7 ^ 2` ensuring attention to order of operations and paranthesses'
						)
				}),
				execute: async ({ expression }) => {
					try {
						return mj.evaluate(expression);
					} catch (e) {
						return `Math failed with error ${e}`;
					}
				}
			}),
			nameChat: tool({
				description: `This tool renames the chat window. The chat name is currently "${chatInfo[0].name}"
				CRITICAL INSTRUCTION: Immediately upon receiving the user's *first* message, you *must* use the nameChat tool to rename the chat.
				Choose a concise, descriptive name (max 5 words) based on the first message.
				Do not perform any other action or generate any response until you have attempted to rename the chat.`,
				parameters: z.object({
					newName: z
						.string()
						.describe(
							"A concise, descriptive name for the chat, up to 5 words, based on the user's first substantive message."
						)
				}),
				execute: async ({ newName }) => {
					await db
						.update(threadsTable)
						.set({
							name: newName
						})
						.where(eq(threadsTable.id, params.chatId));

					return `Chat name set to ${newName}`;
				}
			})
		},
		toolChoice: 'auto',
		onError: (e) => {
			console.warn(e);
			return error(500, 'An error occured');
		},
		onFinish: async ({ response }) => {
			const newMessagesField = appendResponseMessages({
				messages,
				responseMessages: response.messages
			});

			await db
				.update(threadsTable)
				.set({
					messages: JSON.stringify(newMessagesField)
				})
				.where(eq(threadsTable.id, params.chatId));

			await db
				.update(usersTable)
				.set({
					messagesSent: sql`${usersTable.messagesSent} + 1`
				})
				.where(eq(usersTable.id, user.id));
		}
	});

	res.consumeStream();
	return res.toDataStreamResponse({});
};
