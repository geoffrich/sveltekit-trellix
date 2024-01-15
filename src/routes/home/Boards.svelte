<script lang="ts">
	import { page } from '$app/stores';
	import Board from './Board.svelte';
	import type { PageData } from './$types';

	$: boards = ($page.data as PageData).boards;

	/*
    notes: no useLoaderData, can use $page.data and import $types from page
    */
</script>

<div class="p-8">
	<h2 class="mb-2 text-xl font-bold">Boards</h2>
	<nav class="flex flex-wrap gap-8">
		{#each boards as board (board.id)}
			<Board name={board.name} id={board.id} color={board.color} />
		{/each}
	</nav>
</div>
