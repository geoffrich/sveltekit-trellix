import { getAuthFromRequest } from '$lib/auth/auth';
import { redirect } from '@sveltejs/kit';

export async function load(request) {
	let auth = await getAuthFromRequest(request);
	if (auth && new URL(request.url).pathname === '/') {
		redirect(302, '/home');
	}
	return {
		userId: auth
	};
}

/*
TODO
export function shouldRevalidate({ formAction }: ShouldRevalidateFunctionArgs) {
  return formAction && ["/login", "/signup", "logout"].includes(formAction);
}
*/
