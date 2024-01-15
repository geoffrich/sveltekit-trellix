<script>
	import Boards from './Boards.svelte';
	import NewBoard from './NewBoard.svelte';
</script>

<svelte:head>
	<title>Boards</title>
</svelte:head>

<div class="h-full">
	<NewBoard />
	<Boards />
</div>
