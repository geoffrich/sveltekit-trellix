<script lang="ts">
	import invariant from 'tiny-invariant';
	import Icon from '$lib/icons/Icon.svelte';
	import { type ItemMutation, CONTENT_TYPES } from './types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	export let title: string;
	export let content: string | null;
	export let id: string;
	export let columnId: string;
	export let order: number;
	export let nextOrder: number;
	export let previousOrder: number;

	let acceptDrop: 'none' | 'top' | 'bottom' = 'none';
	let isDeleting = false; // notes: alternative to deleteFetcher.state !== 'idle'

	async function handleDrop(event: DragEvent) {
		event.stopPropagation();

		let transfer = JSON.parse(event.dataTransfer.getData(CONTENT_TYPES.card));
		invariant(transfer.id, 'missing cardId');
		invariant(transfer.title, 'missing title');

		let droppedOrder = acceptDrop === 'top' ? previousOrder : nextOrder;
		let moveOrder = (droppedOrder + order) / 2;

		// notes: have to construct FormData, no helper to submit
		// this means it isn't as typesafe too
		const formData = new FormData();
		formData.append('order', moveOrder.toString());
		formData.append('columnId', columnId);
		formData.append('id', transfer.id);
		formData.append('title', transfer.title);

		// TODO extract into helper
		const result = fetch(`?/moveItem`, {
			method: 'POST',
			body: formData,
			headers: {
				Accept: 'application/json'
			}
		});
		// TODO fetcherKey: `card:${transfer.id}`,
		acceptDrop = 'none';
		// TODO check result type
		await result;
		await invalidateAll();
	}

	// notes: react difference - draggable="true" required as opposed to draggable
</script>

{#if !isDeleting}
	<li
		on:dragover={(event) => {
			if (event.dataTransfer.types.includes(CONTENT_TYPES.card)) {
				event.preventDefault();
				event.stopPropagation();
				let rect = event.currentTarget.getBoundingClientRect();
				let midpoint = (rect.top + rect.bottom) / 2;
				acceptDrop = event.clientY <= midpoint ? 'top' : 'bottom';
			}
		}}
		on:dragleave={() => {
			acceptDrop = 'none';
		}}
		on:drop={handleDrop}
		class={'-mb-[2px] cursor-grab border-b-2 border-t-2 px-2 py-1 last:mb-0 active:cursor-grabbing ' +
			(acceptDrop === 'top'
				? 'border-t-brand-red border-b-transparent'
				: acceptDrop === 'bottom'
					? 'border-b-brand-red border-t-transparent'
					: 'border-b-transparent border-t-transparent')}
	>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			draggable="true"
			class="relative w-full rounded-lg border-slate-300 bg-white px-2 py-1 text-sm shadow shadow-slate-300"
			on:dragstart={(event) => {
				event.dataTransfer.effectAllowed = 'move';
				event.dataTransfer.setData(CONTENT_TYPES.card, JSON.stringify({ id, title }));
			}}
		>
			<h3>{title}</h3>
			<div class="mt-2">
				{#if content}{content}{:else}&nbsp;{/if}
			</div>
			<form
				method="post"
				action="?/deleteCard"
				use:enhance={() => {
					isDeleting = true;
					return async ({ update }) => {
						await update();
						isDeleting = false;
					};
				}}
			>
				<input type="hidden" name="itemId" value={id} />
				<button
					aria-label="Delete card"
					class="hover:text-brand-red absolute right-4 top-4"
					type="submit"
					on:click={(event) => {
						event.stopPropagation();
					}}
				>
					<Icon name="trash" />
				</button>
			</form>
		</div>
	</li>
{/if}
