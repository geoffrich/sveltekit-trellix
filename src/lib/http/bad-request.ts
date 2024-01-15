import { fail } from '@sveltejs/kit';

export function badRequest(body: string) {
	fail(400, {
		body
	});
}
