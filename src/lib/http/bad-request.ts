import { error, fail } from '@sveltejs/kit';

export function badRequest(body: string) {
	fail(400, {
		body
	});
}

export function notFound() {
	error(404, 'Not found');
}
