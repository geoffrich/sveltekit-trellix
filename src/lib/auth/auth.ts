import { redirect, type RequestEvent } from '@sveltejs/kit';

/*
// TODO
let secret = process.env.COOKIE_SECRET || "default";
if (secret === "default") {
  console.warn(
    "🚨 No COOKIE_SECRET environment variable set, using default. The app is insecure in production.",
  );
  secret = "default-secret";
}

let cookie = createCookie("auth", {
  secrets: [secret],
  // 30 days
  maxAge: 30 * 24 * 60 * 60,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});
*/

export async function getAuthFromRequest(request: RequestEvent) {
	return request.cookies.get('auth') ?? null;
}

export async function setAuthOnResponse(request: RequestEvent, userId: string) {
	request.cookies.set('auth', userId, {
		maxAge: 30 * 24 * 60 * 60,
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/'
	});
}

export async function requireAuthCookie(request: RequestEvent) {
	let userId = await getAuthFromRequest(request);
	if (!userId) {
		request.cookies.delete('auth', {
			path: '/'
		});
		redirect(302, '/login');
	}
	return userId;
}

export async function redirectIfLoggedInLoader(request: RequestEvent) {
	let userId = await getAuthFromRequest(request);
	if (userId) {
		redirect(302, '/home');
	}

	return null;
}

export async function redirectWithClearedCookie(request: RequestEvent) {
	request.cookies.delete('auth', {
		path: '/'
	});
	redirect(302, '/');
}
