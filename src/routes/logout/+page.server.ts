import { redirectWithClearedCookie } from '$lib/auth/auth.js';

export const actions = {
	default: (request) => redirectWithClearedCookie(request)
};
