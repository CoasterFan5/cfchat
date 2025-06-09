import { db } from '$lib/server/db/index.js';
import { threadsTable } from '$lib/server/db/schema.js';
import { validateSession } from '$lib/server/validateSession';
import { redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load = async ({ cookies, params }) => {
	const user = await validateSession(cookies);
	if (!user) {
		throw redirect(303, '/');
	}

	const threads = await db
		.select()
		.from(threadsTable)
		.where(and(eq(threadsTable.id, params.chatId), eq(threadsTable.userId, user.id)));

	const thread = threads[0];
	if (!thread) {
		throw redirect(303, '/');
	}

	return { thread };
};
