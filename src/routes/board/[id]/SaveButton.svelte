<script>
	export let el;
</script>

<button
	bind:this={el}
	on:click
	tabIndex={0}
	{...$$props}
	class="bg-brand-blue rounded-lg p-2 text-left text-sm font-medium text-white"
>
	<slot />
</button>
