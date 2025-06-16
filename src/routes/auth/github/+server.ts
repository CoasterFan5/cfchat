import { redirect, type RequestHandler } from '@sveltejs/kit';

import { GITHUB_CLIENT_ID } from '$env/static/private';

export const GET: RequestHandler = async ({ request }) => {
	const ghUrl = new URL(`https://github.com/login/oauth/authorize`);
	ghUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
	ghUrl.searchParams.set('redirect_uri', `${request.url}/finish`);

	return redirect(307, ghUrl.toString());
};
