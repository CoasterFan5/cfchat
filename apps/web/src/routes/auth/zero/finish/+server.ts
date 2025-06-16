import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ZERO_TOKEN } from '$env/static/private';
import { z } from 'zod/v4';
import { db } from '$lib/server/db';
import { userIndetitiesTable, usersTable } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm/gel-core/expressions';
import { createSession } from '$lib/server/createSession';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const code = url.searchParams.get('code');
	if (!code) {
		throw redirect(303, '/auth/zero');
	}

	const zeroExchangeUrl = new URL('https://zero.coasterfan5.com/api/exchange');
	zeroExchangeUrl.searchParams.set('code', code);
	zeroExchangeUrl.searchParams.set('token', ZERO_TOKEN);

	const apiReq = await fetch(zeroExchangeUrl.toString());
	const response = await apiReq.json();

	const parsedResponse = z
		.object({
			token: z.string()
		})
		.safeParse(response);

	if (parsedResponse.error) {
		return error(500, 'Something went wrong');
	}

	const apiReqUrl = new URL('https://zero.coasterfan5.com/api/user');
	apiReqUrl.searchParams.set('token', parsedResponse.data.token);

	const apiUserReq = await fetch(apiReqUrl.toString());
	const userParsed = z
		.object({
			id: z.coerce.number(),
			name: z.string(),
			email: z.string()
		})
		.safeParse(await apiUserReq.json());

	if (userParsed.error) {
		return error(500, {
			message: 'Something went wrong'
		});
	}

	const user = userParsed.data;

	const identityCheck = await db
		.select()
		.from(userIndetitiesTable)
		.where(
			and(
				eq(userIndetitiesTable.provider, 'zero'),
				eq(userIndetitiesTable.providerUserId, user.id.toString())
			)
		)
		.leftJoin(usersTable, eq(usersTable.id, userIndetitiesTable.userId));

	let userId: string = identityCheck[0]?.user?.id || '';

	if (identityCheck.length < 1) {
		console.warn('New User Registration');
		const newUser = await db
			.insert(usersTable)
			.values({
				name: user.name,
				email: user.email
			})
			.returning();

		userId = newUser[0].id as string;
		await db.insert(userIndetitiesTable).values({
			userId: userId,
			provider: 'zero',
			providerUserId: user.id.toString(),
			createdAt: new Date()
		});
	}

	await createSession(userId, cookies);

	throw redirect(303, '/');
};
