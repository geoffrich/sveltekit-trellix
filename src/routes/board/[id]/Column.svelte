<script lang="ts">
	import { tick } from 'svelte';
	import invariant from 'tiny-invariant';
	import Icon from '$lib/icons/Icon.svelte';

	import { type ItemMutation, INTENTS, CONTENT_TYPES, type RenderedItem } from './types';
	import NewCard from './NewCard.svelte';
	import Card from './Card.svelte';
	import EditableText from './EditableText.svelte';
	import { invalidateAll } from '$app/navigation';
	import { pendingFetchers } from './pending';

	export let name: string;
	export let columnId: string;
	export let items: RenderedItem[];

	let acceptDrop = false;
	let edit = false;
	let listRef: HTMLUListElement;

	function scrollList() {
		invariant(listRef);
		listRef.scrollTop = listRef.scrollHeight;
	}

	async function handleDrop(event: DragEvent) {
		let transfer = JSON.parse(event.dataTransfer.getData(CONTENT_TYPES.card));
		invariant(transfer.id, 'missing transfer.id');
		invariant(transfer.title, 'missing transfer.title');

		const formData = new FormData();
		formData.append('order', '1');
		formData.append('columnId', columnId);
		formData.append('id', transfer.id);
		formData.append('title', transfer.title);

		const controller = new AbortController();
		pendingFetchers.add(`card:${transfer.id}`, formData, '?/moveItem', controller);

		// TODO helper
		const result = fetch(`?/moveItem`, {
			method: 'POST',
			body: formData,
			headers: {
				Accept: 'application/json'
			},
			signal: controller.signal
		});

		acceptDrop = false;

		await result;
		await invalidateAll();

		pendingFetchers.remove(`card:${transfer.id}`);
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={'flex max-h-full w-80 flex-shrink-0 flex-col overflow-hidden rounded-xl border-slate-400 bg-slate-100 shadow-sm shadow-slate-400 ' +
		(acceptDrop ? `outline-brand-red outline outline-2` : ``)}
	on:dragover={(event) => {
		if (items.length === 0 && event.dataTransfer.types.includes(CONTENT_TYPES.card)) {
			event.preventDefault();
			acceptDrop = true;
		}
	}}
	on:dragleave={() => {
		acceptDrop = false;
	}}
	on:drop={handleDrop}
>
	<div class="p-2">
		<EditableText
			fieldName="name"
			value={name}
			inputLabel="Edit column name"
			buttonLabel={`Edit column "${name}" name`}
			inputClassName="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
			buttonClassName="block rounded-lg text-left w-full border border-transparent py-1 px-2 font-medium text-slate-600"
			formAction="?/updateColumn"
		>
			<input type="hidden" name="columnId" value={columnId} />
		</EditableText>
	</div>

	<ul bind:this={listRef} class="flex-grow overflow-auto">
		{#each [...items].sort((a, b) => a.order - b.order) as item, index (item.id)}
			<Card
				key={item.id}
				title={item.title}
				content={item.content}
				id={item.id}
				order={item.order}
				{columnId}
				previousOrder={items[index - 1] ? items[index - 1].order : 0}
				nextOrder={items[index + 1] ? items[index + 1].order : item.order + 1}
			/>
		{/each}
	</ul>
	{#if edit}
		<NewCard
			{columnId}
			nextOrder={items.length === 0 ? 1 : items[items.length - 1].order + 1}
			onAddCard={() => scrollList()}
			onComplete={() => (edit = false)}
		/>
	{:else}
		<div class="p-2">
			<button
				type="button"
				on:click={() => {
					edit = true;
					tick().then(() => {
						scrollList();
					});
				}}
				class="flex w-full items-center gap-2 rounded-lg p-2 text-left font-medium text-slate-500 hover:bg-slate-200 focus:bg-slate-200"
			>
				<Icon name="plus" /> Add a card
			</button>
		</div>
	{/if}
</div>
