<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';

	import { Label, LabeledInput } from '$lib/components/input';

	let isCreating = false;
</script>

<form
	method="post"
	class="max-w-md p-8"
	use:enhance={() => {
		isCreating = true;
		return async ({ update }) => {
			await update();
			isCreating = false;
		};
	}}
	action="?/createBoard"
>
	<div>
		<h2 class="mb-2 text-xl font-bold">New Board</h2>
		<LabeledInput label="Name" name="name" type="text" required />
	</div>

	<div class="mt-4 flex items-center gap-4">
		<div class="flex items-center gap-1">
			<Label htmlFor="board-color">Color</Label>
			<input id="board-color" name="color" type="color" value="#cbd5e1" class="bg-transparent" />
		</div>
		<Button type="submit">{isCreating ? 'Creating...' : 'Create'}</Button>
	</div>
</form>
