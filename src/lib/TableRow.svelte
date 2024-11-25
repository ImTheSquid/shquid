<script lang="ts">
	import type { Link } from '$lib';

	const { item, editable }: { item: Link; editable: boolean } = $props();

	let edit = $state(false);
	let editItem = $state(item);
</script>

<tr>
	{#if edit}
		<td class="border-gray-301 border px-4 py-2"
			><input class="border" bind:value={editItem.key} /></td
		>
		<td class="border-gray-301 border px-4 py-2"
			><input class="border" bind:value={editItem.target} /></td
		>
	{:else}
		<td class="border-gray-301 border px-4 py-2">{item.key}</td>
		<td class="border-gray-301 border px-4 py-2">{item.target}</td>
	{/if}
	<td class="border-gray-301 border px-4 py-2">{item.owner}</td>
	<td class="border-gray-301 border px-4 py-2">{item.hits}</td>
	{#if edit}
		<td class="border-gray-301 border px-4 py-2"
			>Private?: <input type="checkbox" bind:checked={editItem.priv} />
		</td>
	{:else}
		<td class="border-gray-301 border px-4 py-2">{item.priv ? '🔒' : '🌐'}</td>
	{/if}
	{#if edit}
		<td class="border-gray-301 flex border px-4 py-2">
			<form method="POST" action="?/update">
				<input type="hidden" value={item.key} name="oldKey" />
				<input type="hidden" value={editItem.key} name="key" />
				<input type="hidden" value={editItem.target} name="target" />
				<input type="hidden" value={editItem.priv} name="priv" />
				<button class="m-1 rounded bg-gray-300 p-1"> Save </button>
			</form>
			<button
				class="m-1 rounded bg-red-300 p-1"
				onclick={() => {
					edit = false;
					editItem = item;
				}}
			>
				Cancel
			</button>
		</td>
	{:else if editable}
		<td class="border-gray-301 flex border px-4 py-2">
			<button
				class="m-1 rounded bg-gray-300 p-1"
				onclick={() => {
					edit = true;
				}}
			>
				Edit
			</button>
			<form method="POST" action="?/delete">
				<input type="hidden" value={item.key} name="key" />
				<button class="m-1 rounded bg-red-300 p-1"> Delete </button>
			</form>
		</td>
	{/if}
</tr>
