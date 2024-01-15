<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';

	export let fieldName: string;
	export let value: string;
	export let inputClassName: string;
	export let inputLabel: string;
	export let buttonClassName: string;
	export let buttonLabel: string;
	export let formAction: string; // instead of hidden intent input

	let edit = false;
	let inputRef: HTMLInputElement;
	let buttonRef: HTMLButtonElement;

	let formRef: HTMLFormElement;

	let submittedFormData: FormData | null = null;

	// notes: can't retrieve from fetcher.formData
	$: optimisticValue = submittedFormData?.get(fieldName) ?? value;

	// notes: no split between form and fetcher.Form
</script>

{#if edit}
	<form
		method="post"
		action={formAction}
		use:enhance={({ formData }) => {
			// submittedFormData = formData;
			return async ({ result, update }) => {
				await update();
				// TODO: focus behavior wonky here
				submittedFormData = null;
			};
		}}
		bind:this={formRef}
	>
		<slot />
		<input
			required
			bind:this={inputRef}
			type="text"
			aria-label={inputLabel}
			name={fieldName}
			value={optimisticValue}
			class={inputClassName}
			on:keydown={(event) => {
				if (event.key === 'Escape') {
					edit = false;
					tick().then(() => buttonRef.focus());
				}
			}}
			on:blur={(event) => {
				if (inputRef.value !== optimisticValue && inputRef.value.trim() !== '') {
					formRef.requestSubmit();
					// notes: alternative to fetcher.submit(event.currentTarget);
				}
				edit = false;
			}}
		/>
	</form>
{:else}
	<button
		aria-label={buttonLabel}
		type="button"
		bind:this={buttonRef}
		on:click={() => {
			edit = true;
			tick().then(() => inputRef.select());
		}}
		class={buttonClassName}
	>
		{#if optimisticValue}
			{optimisticValue}
		{:else}
			<span class="italic text-slate-400">Edit</span>
		{/if}
	</button>
{/if}
