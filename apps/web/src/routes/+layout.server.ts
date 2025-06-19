import { createSession } from '$lib/server/createSession.js';
import { db } from '$lib/server/db/index.js';
import { threadsTable, usersTable } from 'database/schema';
import { validateSession } from '$lib/server/validateSession.js';
import { desc, eq } from 'drizzle-orm';

export const load = async ({ cookies }) => {
	let user = await validateSession(cookies);

	if (!user) {
		user = (await db.insert(usersTable).values({}).returning())[0];
		await createSession(user.id, cookies);
	}

	const threads = await db
		.select({
			name: threadsTable.name,
			id: threadsTable.id
		})
		.from(threadsTable)
		.where(eq(threadsTable.userId, user.id))
		.orderBy(desc(threadsTable.createdAt));

	return {
		threadList: threads,
		user: user
	};
};
