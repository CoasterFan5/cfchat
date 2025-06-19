import { db } from '$lib/server/db';
import { giftsTable, usersTable } from 'database/schema';
import type { PageServerLoad } from './$types';
import { eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/validateSession';

export const load: PageServerLoad = async ({ params }) => {
	const gifts = await db.select().from(giftsTable).where(eq(giftsTable.id, params.giftId));
	const gift = gifts[0];
	if (!gift) {
		return error(404, 'Not Found');
	}

	return { gift };
};

export const actions = {
	claimGift: async ({ cookies, params }) => {
		const gifts = await db.select().from(giftsTable).where(eq(giftsTable.id, params.giftId));
		const gift = gifts[0];
		if (!gift) {
			return error(404, 'Not Found');
		}

		if (gift.uses <= 0) {
			return error(500, 'Max Uses Reached');
		}

		const user = await validateSession(cookies);
		if (!user) {
			return error(400, 'how');
		}

		await db
			.update(usersTable)
			.set({
				messagesSent: sql`${usersTable.messagesSent} - ${gift.messageCount}`
			})
			.where(eq(usersTable.id, user.id));

		await db
			.update(giftsTable)
			.set({
				uses: sql`${giftsTable.uses} - 1`
			})
			.where(eq(giftsTable.id, gift.id));

		return {
			message: 'Gift Claimed!'
		};
	}
};
