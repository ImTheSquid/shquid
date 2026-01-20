<script lang="ts">
	import type { Link } from '$lib';
	import TableRow from './TableRow.svelte';

	const { links, editable = false }: { links: Link[]; editable?: boolean } = $props();
</script>

<!-- Desktop table view -->
<div class="hidden w-full overflow-x-auto sm:block">
	<table class="w-full border-collapse border border-gray-300">
		<thead>
			<tr class="bg-gray-50">
				<th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Key</th>
				<th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Target</th>
				<th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Owner</th>
				<th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Hits</th>
				<th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Privacy</th>
				{#if editable}
					<th class="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Actions</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each links as item (item.key)}
				<TableRow {item} {editable} mode="table" />
			{/each}
		</tbody>
	</table>
</div>

<!-- Mobile card view -->
<div class="flex w-full flex-col gap-3 sm:hidden">
	{#each links as item (item.key)}
		<TableRow {item} {editable} mode="card" />
	{/each}
	{#if links.length === 0}
		<p class="text-center text-gray-500">No links to display</p>
	{/if}
</div>
