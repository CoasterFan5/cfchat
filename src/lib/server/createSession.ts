import type { Cookies } from '@sveltejs/kit';
import { cuid } from './cuid';
import { db } from './db';
import { sessionsTable } from './db/schema';
import { dev } from '$app/environment';

export const createSession = async (userId: string, cookies: Cookies) => {
	const newSession = await db
		.insert(sessionsTable)
		.values({
			userId: userId,
			token: cuid()
		})
		.returning();

	cookies.set('session', newSession[0].token, {
		path: '/',
		secure: dev,
		sameSite: 'strict'
	});

	return newSession[0];
};
