import { redirectIfLoggedInLoader, setAuthOnResponse } from '$lib/auth/auth';
import { fail, redirect } from '@sveltejs/kit';
import { login } from './queries';
import { validate } from './validate';

export const load = redirectIfLoggedInLoader;

export const actions = {
	default: async (requestEvent) => {
		const { request } = requestEvent;
		let formData = await request.formData();
		let email = String(formData.get('email') || '');
		let password = String(formData.get('password') || '');

		let errors = validate(email, password);
		if (errors) {
			return fail(400, { ok: false, errors });
		}

		let userId = await login(email, password);
		if (userId === false) {
			return fail(400, { ok: false, errors: { password: 'Invalid credentials' } });
		}

		setAuthOnResponse(requestEvent, userId);
		redirect(302, '/home');
	}
};
