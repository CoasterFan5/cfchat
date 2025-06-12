import { appendResponseMessages, streamText, tool } from 'ai';
import { z } from 'zod';
import * as mj from 'mathjs';
import { db } from '$lib/server/db/index.js';
import { threadsTable } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/validateSession.js';
import { getModel } from '$lib/server/getModel';

export const POST = async ({ request, params, cookies }) => {
	console.log(`Gateway Request`);

	const userPromise = validateSession(cookies);
	const chatInfoPromise = db.select().from(threadsTable).where(eq(threadsTable.id, params.chatId));
	const requestJsonPromise = request.json();

	const user = await userPromise;
	if (!user) {
		return error(400, {
			message: 'Invalid Session'
		});
	}
	const chatInfo = await chatInfoPromise;
	if (!chatInfo[0]) {
		return error(404, {
			message: 'Chat not found'
		});
	}
	console.log(chatInfo);
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
					console.log('Time');
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
				If the name is currently New Thread you must rename the chat window **Immediately** to reflect the message of the user.
				Before you respond for the first time, its essential you rename the chat. Do not rename the chat a second time.
				`,
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
			console.error(e);
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
		}
	});

	res.consumeStream();
	return res.toDataStreamResponse({});
};
