import { actionHelper } from '$lib/server/actionHelper';
import { redirect } from '@sveltejs/kit';
import { z } from 'zod/v4';

export const load = async () => {
	throw redirect(303, '/');
};

export const actions = {
	createChat: actionHelper(
		z.object({
			prompt: z.string()
		}),
		async ({ prompt }, { cookies }) => {
			console.log(prompt);
			throw redirect(303, '/chat/1');
		}
	)
};
