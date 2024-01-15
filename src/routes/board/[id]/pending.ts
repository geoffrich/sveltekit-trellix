import { writable } from 'svelte/store';

const pendingStore = writable<{ id: string; formData: FormData; action: string }[]>([]);

const seenIds = new Set<string>();

export const pendingFetchers = {
	subscribe: pendingStore.subscribe,
	add(id: string, formData: FormData, action: string) {
		pendingStore.update((items) => [...items.filter((i) => i.id !== id), { id, formData, action }]);
		seenIds.add(id);
	},
	remove(id: string) {
		pendingStore.update((items) => items.filter((i) => i.id !== id));
		seenIds.delete(id);
	}
};
