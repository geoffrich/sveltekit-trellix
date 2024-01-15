import { requireAuthCookie } from '$lib/auth/auth';
import { badRequest, notFound } from '$lib/http/bad-request';
import type { RequestEvent } from './$types.js';
import {
	createColumn,
	updateColumnName,
	getBoardData,
	upsertItem,
	updateBoardName,
	deleteCard
} from './queries';
import invariant from 'tiny-invariant';
import { parseItemMutation } from './utils.js';

export async function load(request) {
	let accountId = await requireAuthCookie(request);
	const { params } = request;

	invariant(params.id, 'Missing board ID');
	let id = Number(params.id);

	let board = await getBoardData(id, accountId);
	if (!board) throw notFound();

	return { board };
}

async function getData(requestEvent: RequestEvent) {
	let accountId = await requireAuthCookie(requestEvent);
	const { request, params } = requestEvent;

	let boardId = Number(params.id);
	invariant(boardId, 'Missing boardId');
	let formData = await request.formData();

	return { boardId, formData, accountId };
}

async function upsert(requestEvent: RequestEvent) {
	const { formData, boardId, accountId } = await getData(requestEvent);
	let mutation = parseItemMutation(formData);
	await upsertItem({ ...mutation, boardId }, accountId);
	return { ok: true };
}

export const actions = {
	deleteCard: async (requestEvent) => {
		const { accountId, formData } = await getData(requestEvent);
		let id = String(formData.get('itemId') || '');
		await deleteCard(id, accountId);
		return { ok: true };
	},
	updateBoardName: async (requestEvent) => {
		const { accountId, formData, boardId } = await getData(requestEvent);
		let name = String(formData.get('name') || '');
		invariant(name, 'Missing name');
		await updateBoardName(boardId, name, accountId);
		return { ok: true };
	},
	moveItem: upsert,
	createItem: upsert,
	createColumn: async (requestEvent) => {
		const { formData, boardId, accountId } = await getData(requestEvent);
		let { name, id } = Object.fromEntries(formData);
		invariant(name, 'Missing name');
		invariant(id, 'Missing id');
		await createColumn(boardId, String(name), String(id), accountId);
		return { ok: true };
	},
	updateColumn: async (requestEvent) => {
		const { formData, accountId } = await getData(requestEvent);
		let { name, columnId } = Object.fromEntries(formData);
		if (!name || !columnId) throw badRequest('Missing name or columnId');
		await updateColumnName(String(columnId), String(name), accountId);
		return { ok: true };
	}
};
