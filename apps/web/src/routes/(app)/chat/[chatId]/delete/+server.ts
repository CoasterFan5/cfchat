import { threadsTable } from 'database/schema';
import type { RequestHandler } from './$types';
import { and } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/validateSession';

export const DELETE: RequestHandler = async ({ cookies, params }) => {
	const user = await validateSession(cookies);
	if (!user) {
		return error(400, {
			message: 'No Account'
		});
	}

	const threadArray = await db
		.select()
		.from(threadsTable)
		.where(and(eq(threadsTable.id, params.chatId), eq(threadsTable.userId, user.id)));

	const thread = threadArray[0];
	if (!thread) {
		return error(404, {
			message: 'No Thread'
		});
	}

	await db.delete(threadsTable).where(eq(threadsTable.id, thread.id));

	return new Response();
};
