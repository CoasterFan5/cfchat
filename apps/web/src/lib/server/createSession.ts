import type { Cookies } from '@sveltejs/kit';
import { cuid } from './cuid';
import { db } from './db';
import { sessionsTable } from 'database/schema';
import { dev } from '$app/environment';

const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

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
		secure: !dev,
		sameSite: 'lax',
		expires: new Date(Date.now() + NINETY_DAYS)
	});

	return newSession[0];
};
