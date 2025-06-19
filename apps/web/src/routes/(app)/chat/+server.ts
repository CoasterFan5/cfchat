import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateSession } from '$lib/server/validateSession';
import { db } from '$lib/server/db';
import { threadsTable } from 'database/schema';

export const POST: RequestHandler = async ({ cookies, request }) => {
	const user = await validateSession(cookies);
	const messages = await request.json();

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
			messages: JSON.stringify(messages),
			selectedModel: user.selectedModel || undefined
		})
		.returning();

	return new Response(
		JSON.stringify({
			newThreadId: newThread[0].id
		})
	);
};
