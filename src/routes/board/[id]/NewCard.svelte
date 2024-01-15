<script lang="ts">
	import invariant from 'tiny-invariant';
	import SaveButton from './SaveButton.svelte';
	import CancelButton from './CancelButton.svelte';
	import { ItemMutationFields } from './types';
	import { enhance } from '$app/forms';

	export let columnId: string;
	export let nextOrder: number;
	export let onComplete: () => void;
	export let onAddCard: () => void;

	let textAreaRef: HTMLTextAreaElement;
	let buttonRef: HTMLButtonElement;
</script>

<form
	method="post"
	class="border-b-2 border-t-2 border-transparent px-2 py-1"
	action="?/createItem"
	use:enhance={({ formData }) => {
		// note: alternative to constructing formdata and calling submit
		let id = crypto.randomUUID();
		formData.set(ItemMutationFields.id.name, id);
		invariant(textAreaRef);
		textAreaRef.value = '';
		onAddCard();

		// TODO fetcherKey: `card:${id}`,
	}}
	on:blur={(event) => {
		if (!event.currentTarget.contains(event.relatedTarget)) {
			onComplete();
		}
	}}
>
	<input type="hidden" name={ItemMutationFields.columnId.name} value={columnId} />
	<input type="hidden" name={ItemMutationFields.order.name} value={nextOrder} />

	<textarea
		autoFocus
		required
		bind:this={textAreaRef}
		name={ItemMutationFields.title.name}
		placeholder="Enter a title for this card"
		class="h-14 w-full resize-none rounded-lg px-2 py-1 text-sm shadow outline-none placeholder:text-sm placeholder:text-slate-500"
		on:keydown={(event) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				invariant(buttonRef, 'expected button ref');
				buttonRef.click();
			}
			if (event.key === 'Escape') {
				onComplete();
			}
		}}
		on:change={(event) => {
			let el = event.currentTarget;
			el.style.height = el.scrollHeight + 'px';
		}}
	/>
	<div class="flex justify-between">
		<SaveButton bind:el={buttonRef}>Save Card</SaveButton>
		<CancelButton on:click={onComplete}>Cancel</CancelButton>
	</div>
</form>
