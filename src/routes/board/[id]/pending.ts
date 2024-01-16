import { get, writable } from 'svelte/store';

const pendingStore = writable<
	{ id: string; formData: FormData; action: string; controller?: AbortController }[]
>([]);

const seenIds = new Set<string>();

export const pendingFetchers = {
	subscribe: pendingStore.subscribe,
	add(id: string, formData: FormData, action: string, controller?: AbortController) {
		if (seenIds.has(id)) {
			// TODO more efficient
			const item = get(pendingStore).find((items) => items.id === id);
			item?.controller?.abort();
		}
		pendingStore.update((items) => [
			...items.filter((i) => i.id !== id),
			{ id, formData, action, controller }
		]);
		seenIds.add(id);
	},
	remove(id: string) {
		pendingStore.update((items) => items.filter((i) => i.id !== id));
		seenIds.delete(id);
	}
};
