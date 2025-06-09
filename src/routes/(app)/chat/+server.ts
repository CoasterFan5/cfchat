import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateSession } from '$lib/server/validateSession';
import { db } from '$lib/server/db';
import { threadsTable } from '$lib/server/db/schema';

const systemPrompt = `
  You are an AI assistant designed to fulfill user requests comprehensively and accurately.
  Your primary goal is always to directly answer the user's question or complete their task.
  You have access to various tools that can assist you in this endeavor.
  **These tools are not the objective themselves, but rather a means to achieve the objective.**
  Only use a tool if it is absolutely necessary to gather information, perform a calculation, or execute an action that directly contributes to fulfilling the user's request.
  After using a tool, immediately process its output and use it to formulate your response to the user.
  Do not simply return tool outputs without interpretation or context.
`;

export const POST: RequestHandler = async ({ cookies }) => {
	const user = await validateSession(cookies);

	if (!user) {
		return error(401, {
			message: 'Invalid Session'
		});
	}

	const newThread = await db
		.insert(threadsTable)
		.values({
			name: 'New Thread',
			userId: user.id,
			messages: JSON.stringify([
				{
					role: 'system',
					content: systemPrompt,
					parts: [
						{
							type: 'text',
							text: systemPrompt
						}
					]
				},
				{
					role: 'user',
					content: 'Hello',
					parts: [
						{
							type: 'text',
							text: 'Hello'
						}
					]
				}
			])
		})
		.returning();

	return new Response(
		JSON.stringify({
			threadId: newThread[0].id
		})
	);
};
