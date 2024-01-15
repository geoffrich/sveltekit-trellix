<script lang="ts">
	import SaveButton from './SaveButton.svelte';
	import CancelButton from './CancelButton.svelte';
	import Icon from '$lib/icons/Icon.svelte';
	import invariant from 'tiny-invariant';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';

	export let boardId: number;
	export let onAdd: () => void;
	export let editInitially: boolean;

	let editing = editInitially;
	let inputRef: HTMLInputElement;

	// notes: no navigate={false} on form
</script>

{#if editing}
	<form
		use:enhance={({ formData }) => {
			// Note: alternative to manually calling submit() in Remix
			formData.set('id', crypto.randomUUID());
			onAdd();
			invariant(inputRef, 'missing input ref');
			inputRef.value = '';
		}}
		method="post"
		action="?/createColumn"
		class="flex max-h-full w-80 flex-shrink-0 flex-col gap-5 overflow-hidden rounded-xl border bg-slate-100 p-2 shadow"
		on:blur={(event) => {
			if (!event.currentTarget.contains(event.relatedTarget)) {
				editing = false;
			}
		}}
	>
		<input type="hidden" name="boardId" value={boardId} />
		<input
			autoFocus
			required
			bind:this={inputRef}
			type="text"
			name="name"
			class="w-full rounded-lg border border-slate-400 px-2 py-1 font-medium text-black"
		/>
		<div class="flex justify-between">
			<SaveButton>Save Column</SaveButton>
			<CancelButton on:click={() => (editing = false)}>Cancel</CancelButton>
		</div>
	</form>
{:else}
	<button
		on:click={() => {
			editing = true;
			// note: alternative to flushSync
			tick().then(() => onAdd());
		}}
		aria-label="Add new column"
		class="flex h-16 w-16 flex-shrink-0 justify-center rounded-xl bg-black bg-opacity-10 hover:bg-white hover:bg-opacity-5"
	>
		<Icon name="plus" size="xl" />
	</button>
{/if}
