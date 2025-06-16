import type { Cookies } from '@sveltejs/kit';
import { db } from './db';
import { sessionsTable, usersTable } from './db/schema';
import { eq } from 'drizzle-orm';

export const validateSession = async (cookies: Cookies) => {
	const sessionCookie = cookies.get('session');

	if (!sessionCookie) {
		return undefined;
	}

	const sessionWithUser = await db
		.select()
		.from(sessionsTable)
		.where(eq(sessionsTable.token, sessionCookie))
		.leftJoin(usersTable, eq(usersTable.id, sessionsTable.userId));

	const user = sessionWithUser[0]?.user;
	if (!user) {
		return undefined;
	}
	return user;
};
