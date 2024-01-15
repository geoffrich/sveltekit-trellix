<script lang="ts">
	import invariant from 'tiny-invariant';
	import EditableText from './EditableText.svelte';
	import Column from './Column.svelte';
	import NewColumn from './NewColumn.svelte';
	import { pendingFetchers } from './pending';
	import type { RenderedItem } from './types';

	export let data;

	$: columns = getColumns(data.board, $pendingFetchers);

	function getColumns(board: typeof data.board, pendingFetchers: typeof $pendingFetchers) {
		let itemsById = new Map(board.items.map((item) => [item.id, item]));

		let pendingItems = getPendingItems(pendingFetchers);

		// merge pending items and existing items
		for (let pendingItem of pendingItems) {
			let item = itemsById.get(pendingItem.id);
			let merged = item ? { ...item, ...pendingItem } : { ...pendingItem, boardId: board.id };
			itemsById.set(pendingItem.id, merged);
		}

		// merge pending and existing columns
		let optAddingColumns = getPendingColumns($pendingFetchers);
		type Column = (typeof board.columns)[number] | (typeof optAddingColumns)[number];
		type ColumnWithItems = Column & { items: typeof data.board.items };
		let columns = new Map<string, ColumnWithItems>();
		for (let column of [...board.columns, ...optAddingColumns]) {
			columns.set(column.id, { ...column, items: [] });
		}

		// add items to their columns
		for (let item of itemsById.values()) {
			let columnId = item.columnId;
			let column = columns.get(columnId);
			invariant(column, 'missing column');
			column.items.push(item);
		}
		return columns;
	}

	// scroll right when new columns are added
	let scrollContainerRef: HTMLDivElement;
	function scrollRight() {
		invariant(scrollContainerRef, 'no scroll container');
		scrollContainerRef.scrollLeft = scrollContainerRef.scrollWidth;
	}

	function getPendingColumns(pending: typeof $pendingFetchers) {
		return pending
			.filter((fetcher) => fetcher.action === '?/createColumn')
			.map((fetcher) => {
				let name = String(fetcher.formData.get('name'));
				let id = String(fetcher.formData.get('id'));
				return { name, id };
			});
	}

	function getPendingItems(pending: typeof $pendingFetchers) {
		return pending
			.filter((fetcher) => fetcher.action === '?/createItem' || fetcher.action === '?/moveItem')
			.map((fetcher) => {
				let columnId = String(fetcher.formData.get('columnId'));
				let title = String(fetcher.formData.get('title'));
				let id = String(fetcher.formData.get('id'));
				let order = Number(fetcher.formData.get('order'));
				let item: RenderedItem = { title, id, order, columnId, content: null };
				return item;
			});
	}
</script>

<svelte:head>
	<title>{data.board.name} | Trellix</title>
</svelte:head>

<div
	class="flex h-full min-h-0 flex-col overflow-x-scroll"
	bind:this={scrollContainerRef}
	style:background-color={data.board.color}
>
	<h1>
		<EditableText
			value={data.board.name}
			fieldName="name"
			inputClassName="mx-8 my-4 text-2xl font-medium border border-slate-400 rounded-lg py-1 px-2 text-black"
			buttonClassName="mx-8 my-4 text-2xl font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
			buttonLabel={`Edit board "${data.board.name}" name`}
			inputLabel="Edit board name"
			formAction="?/updateBoardName"
		>
			<input type="hidden" name="id" value={data.board.id} />
		</EditableText>
	</h1>

	<div class="flex h-full min-h-0 flex-grow items-start gap-4 px-8 pb-4">
		{#each columns.values() as col (col.id)}
			<Column name={col.name} columnId={col.id} items={col.items} />
		{/each}

		<NewColumn
			boardId={data.board.id}
			onAdd={scrollRight}
			editInitially={data.board.columns.length === 0}
		/>

		<!-- TODO trolling you to add some extra margin to the right of the container with a whole dang div -->
		<div data-lol class="h-1 w-8 flex-shrink-0" />
	</div>
</div>
