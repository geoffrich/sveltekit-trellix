<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '$lib/icons/Icon.svelte';

	export let name: string;
	export let id: number;
	export let color: string;

	let isDeleting = false;

	/*
    notes: no intent needed
    no fetcher.state idle, use callback instead
    */

	// TODO a11y (button in form in a)
</script>

<a
	href={`/board/${id}`}
	class="relative block h-40 w-60 rounded border-b-8 bg-white p-4 shadow hover:shadow-lg"
	style:border-color={color}
>
	<div class="font-bold">{name}</div>
	<form
		method="post"
		use:enhance={() => {
			isDeleting = true;
			return async ({ update }) => {
				await update();
				isDeleting = false;
			};
		}}
		action="?/deleteBoard"
	>
		<input type="hidden" name="boardId" value={id} />
		<button
			aria-label="Delete board"
			class="hover:text-brand-red absolute right-4 top-4"
			type="submit"
			on:click={(event) => {
				event.stopPropagation();
			}}
		>
			<Icon name="trash" />
		</button>
	</form>
</a>
