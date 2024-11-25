<script lang="ts">
	import type { Link } from '$lib';
	import TableRow from './TableRow.svelte';

	const { links, editable = false }: { links: Link[]; editable?: boolean } = $props();
</script>

<table class="table-bordered border-gray-301 table-auto border-collapse border">
	<thead>
		<tr>
			<th class="border-gray-301 border px-4 py-2">Key</th>
			<th class="border-gray-301 border px-4 py-2">Target</th>
			<th class="border-gray-301 border px-4 py-2">Owner</th>
			<th class="border-gray-301 border px-4 py-2">Hits</th>
			<th class="border-gray-301 border px-4 py-2">Privacy</th>
			{#if editable}
				<th class="border-gray-301 border px-4 py-2">Edit Controls</th>
			{/if}
		</tr>
	</thead>
	<tbody>
		{#each links as item (item.key)}
			<TableRow {item} {editable} />
		{/each}
	</tbody>
</table>
