import { createSession } from '$lib/server/createSession.js';
import { db } from '$lib/server/db/index.js';
import { threadsTable, usersTable } from '$lib/server/db/schema.js';
import { validateSession } from '$lib/server/validateSession.js';
import { asc, eq } from 'drizzle-orm';

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
		.orderBy(asc(threadsTable.createdAt));

	return {
		threadList: threads,
		user: user
	};
};
