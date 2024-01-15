<script lang="ts">
	import { page } from '$app/stores';
	import Board from './Board.svelte';
	//import { PageData } from './$types' // TODO not working;

	/*
    notes: no useLoaderData, need to pass down prop or use $page.data
    */
</script>

<div class="p-8">
	<h2 class="mb-2 text-xl font-bold">Boards</h2>
	<nav class="flex flex-wrap gap-8">
		{#each $page.data.boards as board (board.id)}
			<Board name={board.name} id={board.id} color={board.color} />
		{/each}
	</nav>
</div>
