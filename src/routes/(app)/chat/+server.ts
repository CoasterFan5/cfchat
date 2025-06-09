import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateSession } from '$lib/server/validateSession';
import { db } from '$lib/server/db';
import { threadsTable } from '$lib/server/db/schema';

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
			userId: user.id
		})
		.returning();

	return new Response(
		JSON.stringify({
			threadId: newThread[0].id
		})
	);
};
