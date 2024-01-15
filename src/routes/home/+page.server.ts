import { requireAuthCookie } from '$lib/auth/auth';
import { fail, redirect } from '@sveltejs/kit';
import { createBoard, deleteBoard, getHomeData } from './queries';
import { badRequest } from '$lib/http/bad-request';

export async function load(requestEvent) {
	let userId = await requireAuthCookie(requestEvent);
	let boards = await getHomeData(userId);
	return { boards };
}

// notes: named actions as opposed to intent

export const actions = {
	createBoard: async (requestEvent) => {
		const { request } = requestEvent;
		let accountId = await requireAuthCookie(requestEvent);
		let formData = await request.formData();
		let name = String(formData.get('name') || '');
		let color = String(formData.get('color') || '');
		if (!name) badRequest('Bad request');
		let board = await createBoard(accountId, name, color);
		redirect(303, `/board/${board.id}`);
	},
	deleteBoard: async (requestEvent) => {
		const { request } = requestEvent;
		let accountId = await requireAuthCookie(requestEvent);
		let formData = await request.formData();
		let boardId = formData.get('boardId');
		if (!boardId) badRequest('Missing boardId');
		await deleteBoard(Number(boardId), accountId);
		return { ok: true };
	}
};
