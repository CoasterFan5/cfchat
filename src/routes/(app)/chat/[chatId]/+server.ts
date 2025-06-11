import { GOOGLE_TOKEN } from '$env/static/private';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { appendResponseMessages, streamText, tool } from 'ai';
import { z } from 'zod';
import * as mj from 'mathjs';
import * as cheerio from 'cheerio';
import { db } from '$lib/server/db/index.js';
import { threadsTable } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

const goog = createGoogleGenerativeAI({
	apiKey: GOOGLE_TOKEN
});

export const POST = async ({ request, params }) => {
	console.log(`Gateway Request`);

	const chatInfoPromise = db.select().from(threadsTable).where(eq(threadsTable.id, params.chatId));
	const requestJsonPromise = request.json();

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
		model: goog('gemini-2.0-flash'),
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
			openLink: tool({
				description:
					'Opens a webpage and returns the content. Use this tool to retrieve the text content of a url.',
				parameters: z.object({
					link: z
						.string()
						.describe(
							'This is the url of the webpage to open, for example: https://example.com. **IMPORTANT** Only provide a valid URL, anything else will result in an error.'
						)
				}),
				execute: async ({ link }) => {
					console.info(`Attempting to open ${link}`);

					try {
						const r = await fetch(link);
						const b = await r.text();

						const $ = cheerio.load(b);
						const rawText = $.root().text().trim();

						return rawText;
					} catch (e) {
						console.error(e);
						return `The link could not be open and failed with the following error. Do not attempt to open this link again. ${e}`;
					}
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
