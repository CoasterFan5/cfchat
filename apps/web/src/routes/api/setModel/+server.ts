import { z } from 'zod/v4';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/validateSession';
import { db } from '$lib/server/db';
import { threadsTable, usersTable } from 'database/schema';
import { eq, and } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const data = await request.json();

	const parsed = z
		.object({
			modelName: z.string(),
			threadId: z.string().optional()
		})
		.safeParse(data);

	if (parsed.error) {
		return error(500, {
			message: 'Something went wrong'
		});
	}

	const user = await validateSession(cookies);
	if (!user) {
		return error(400, {
			message: 'No User'
		});
	}

	if (!parsed.data.threadId) {
		await db
			.update(usersTable)
			.set({
				selectedModel: parsed.data.modelName
			})
			.where(eq(usersTable.id, user.id));
		return new Response();
	}

	const threadList = await db
		.select()
		.from(threadsTable)
		.where(and(eq(threadsTable.id, parsed.data.threadId), eq(threadsTable.userId, user.id)));

	const thread = threadList[0];
	if (!thread) {
		return error(400, {
			message: 'Invalid Thread Id'
		});
	}
	await db
		.update(threadsTable)
		.set({
			selectedModel: parsed.data.modelName
		})
		.where(eq(threadsTable.id, thread.id));

	return new Response();
};
