import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod/v4';
import { validateSession } from '$lib/server/validateSession';
import { db } from '$lib/server/db';
import { userIndetitiesTable, usersTable } from 'database/schema';
import { and, eq } from 'drizzle-orm';
import { createSession } from '$lib/server/createSession';

/*
This is a lot, sorry.
The basic auth principle is this:
Every user already has a session, even if they are not logged in
This just uses oAuth and stored identities to either restore a previous account login
or alternatively assosiate the oAuth identity (which will be created) with the new account.
*/

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');

	if (code == null) {
		return error(400, {
			message: 'Invalid Code'
		});
	}

	const apiReqUrl = new URL('https://github.com/login/oauth/access_token');
	apiReqUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
	apiReqUrl.searchParams.set('client_secret', GITHUB_CLIENT_SECRET);
	apiReqUrl.searchParams.set('code', code);

	console.log(apiReqUrl);

	const apiReq = await fetch(apiReqUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});
	const res = await apiReq.json();

	const parsed = z
		.object({
			access_token: z.string()
		})
		.safeParse(res);

	if (parsed.error) {
		console.warn(`Zod failed to parse body`);
		console.error(res);
		return error(500, {
			message: 'Could not parse oAuth request'
		});
	}

	const fetchUserDetailsReq = await fetch('https://api.github.com/user', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${parsed.data.access_token}`,
			Accept: 'application/json'
		}
	});

	const userDeetsUnparsed = await fetchUserDetailsReq.json();
	const userDeets = z
		.object({
			login: z.string(),
			id: z.number()
		})
		.safeParse(userDeetsUnparsed);

	if (userDeets.error) {
		return error(500, {
			message: 'Count not parse user details'
		});
	}

	const identityCheck = await db
		.select()
		.from(userIndetitiesTable)
		.leftJoin(usersTable, eq(usersTable.id, userIndetitiesTable.userId))
		.where(
			and(
				eq(userIndetitiesTable.provider, 'github'),
				eq(userIndetitiesTable.providerUserId, userDeets.data.id.toString())
			)
		);

	const identity = identityCheck[0];
	if (identity && identity.user) {
		// Identity already exists, so log in the user its assosiated with.
		await createSession(identity.user.id, cookies);
		throw redirect(303, '/');
	}
	//assosiate the current user with this oAuth identity,
	// dont worry, the user should always exist because we create it in the main layout.server.ts
	const user = await validateSession(cookies);
	if (!user) {
		return error(401, {
			message: 'No account'
		});
	}
	await db.insert(userIndetitiesTable).values({
		userId: user.id,
		provider: 'github',
		providerUserId: userDeets.data.id.toString()
	});

	// update user name and no longer a shadow user
	if (user.shadowUser) {
		await db
			.update(usersTable)
			.set({
				name: userDeets.data.login,
				shadowUser: false,
				messageLimit: 20
			})
			.where(eq(usersTable.id, user.id));
	}

	throw redirect(303, '/');
};
