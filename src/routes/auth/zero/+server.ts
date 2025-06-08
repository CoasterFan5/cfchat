import { redirect, type RequestHandler } from '@sveltejs/kit';

import { ZERO_APP } from '$env/static/private';

export const GET: RequestHandler = async () => {
	return redirect(307, `https://zero.coasterfan5.com/auth?u=${ZERO_APP}`);
};
