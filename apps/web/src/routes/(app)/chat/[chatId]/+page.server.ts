import { actionHelper } from '$lib/server/actionHelper.js';
import { db } from '$lib/server/db/index.js';
import { threadsTable } from 'database/schema';
import { validateSession } from '$lib/server/validateSession';
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod/v4';

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

export const actions = {
	changeModel: actionHelper(
		z.object({
			model: z.string()
		}),
		async ({ model }, { cookies, params }) => {
			const user = await validateSession(cookies);
			if (!user || !params.chatId) {
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

			await db.update(threadsTable).set({
				selectedModel: model
			});
		}
	),
	deleteThread: async ({ cookies, params }) => {
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
	}
};
