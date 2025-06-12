import { db } from '$lib/server/db/index.js';
import { threadsTable } from '$lib/server/db/schema.js';
import { validateSession } from '$lib/server/validateSession.js';
import { eq } from 'drizzle-orm';

export const load = async ({ cookies }) => {
	const user = await validateSession(cookies);

	if (!user) {
		return {
			threadList: []
		};
	}

	const threads = await db
		.select({
			name: threadsTable.name,
			id: threadsTable.id
		})
		.from(threadsTable)
		.where(eq(threadsTable.userId, user.id));

	return {
		threadList: threads,
		user: user
	};
};
