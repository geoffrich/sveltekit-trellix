<script lang="ts">
	import { v4 } from '@lukeed/uuid';
	import Input from './Input.svelte';
	import Label from './Label.svelte';

	export let id: string | undefined = undefined;
	export let label: string;

	let uid = v4();
	id = id ?? uid;
</script>

<Label for={id}>{label}</Label>
<div class="mt-2">
	<Input {...$$props} {id} />
</div>
