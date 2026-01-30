<script lang="ts">
	import type { Link } from '$lib';

	const {
		item,
		editable,
		mode = 'table'
	}: { item: Link; editable: boolean; mode?: 'table' | 'card' } = $props();

	let edit = $state(false);
	let editItem = $state(item);
	let copied = $state(false);

	async function copyLink() {
		const url = `${window.location.origin}/${item.key}`;
		await navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

{#if mode === 'card'}
	<!-- Mobile card layout -->
	<div class="rounded-lg border border-gray-300 bg-white p-4">
		{#if edit}
			<div class="flex flex-col gap-3">
				<div class="flex flex-col gap-1">
					<span class="text-xs font-semibold uppercase text-gray-500">Key</span>
					<input class="w-full rounded border px-3 py-2 text-base" bind:value={editItem.key} />
				</div>
				<div class="flex flex-col gap-1">
					<span class="text-xs font-semibold uppercase text-gray-500">Target</span>
					<input class="w-full rounded border px-3 py-2 text-base" bind:value={editItem.target} />
				</div>
				<div class="flex flex-col gap-1">
					<span class="text-xs font-semibold uppercase text-gray-500">Owner</span>
					<span class="text-sm text-gray-600">{item.owner}</span>
				</div>
				<div class="flex items-center justify-between">
					<div class="flex flex-col gap-1">
						<span class="text-xs font-semibold uppercase text-gray-500">Hits</span>
						<span class="text-sm">{item.hits}</span>
					</div>
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={editItem.priv}
							class="h-5 w-5"
							id="priv-{item.key}"
						/>
						<label for="priv-{item.key}" class="text-sm">Private</label>
					</div>
				</div>
				<div class="flex gap-2 pt-2">
					<form method="POST" action="?/update" class="flex-1">
						<input type="hidden" value={item.key} name="oldKey" />
						<input type="hidden" value={editItem.key} name="key" />
						<input type="hidden" value={editItem.target} name="target" />
						<input type="hidden" value={editItem.priv} name="priv" />
						<button
							class="w-full rounded bg-gray-300 px-4 py-2 text-base font-medium active:bg-gray-400"
							>Save</button
						>
					</form>
					<button
						class="flex-1 rounded bg-red-300 px-4 py-2 text-base font-medium active:bg-red-400"
						onclick={() => {
							edit = false;
							editItem = item;
						}}
					>
						Cancel
					</button>
				</div>
			</div>
		{:else}
			<div class="flex flex-col gap-2">
				<div class="flex items-start justify-between gap-2">
					<div class="min-w-0 flex-1">
						<span class="text-xs font-semibold uppercase text-gray-500">Key</span>
						<div class="flex items-center gap-2">
							<p class="break-all font-medium">{item.key}</p>
							<button
								onclick={copyLink}
								class="rounded bg-gray-200 px-2 py-1 text-xs active:bg-gray-300"
								title="Copy short link"
							>
								{copied ? '✓' : 'Copy'}
							</button>
						</div>
					</div>
					<span class="text-2xl">{item.priv ? '🔒' : '🌐'}</span>
				</div>
				<div>
					<span class="text-xs font-semibold uppercase text-gray-500">Target</span>
					<p class="break-all text-sm text-blue-600">{item.target}</p>
				</div>
				<div class="flex items-center justify-between text-sm text-gray-600">
					<span>Owner: {item.owner}</span>
					<span>Hits: {item.hits}</span>
				</div>
				{#if editable}
					<div class="mt-1 flex gap-2 border-t border-gray-200 pt-3">
						<button
							class="flex-1 rounded bg-gray-300 px-4 py-2 text-base font-medium active:bg-gray-400"
							onclick={() => {
								edit = true;
							}}
						>
							Edit
						</button>
						<form method="POST" action="?/delete" class="flex-1">
							<input type="hidden" value={item.key} name="key" />
							<button
								class="w-full rounded bg-red-300 px-4 py-2 text-base font-medium active:bg-red-400"
								>Delete</button
							>
						</form>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<!-- Desktop table row -->
	<tr>
		{#if edit}
			<td class="border border-gray-300 px-3 py-2">
				<input class="w-full rounded border px-2 py-1" bind:value={editItem.key} />
			</td>
			<td class="border border-gray-300 px-3 py-2">
				<input class="w-full rounded border px-2 py-1" bind:value={editItem.target} />
			</td>
		{:else}
			<td class="border border-gray-300 px-3 py-2 text-sm">
				<div class="flex items-center gap-2">
					<span>{item.key}</span>
					<button
						onclick={copyLink}
						class="rounded bg-gray-200 px-1.5 py-0.5 text-xs active:bg-gray-300"
						title="Copy short link"
					>
						{copied ? '✓' : 'Copy'}
					</button>
				</div>
			</td>
			<td class="max-w-xs truncate border border-gray-300 px-3 py-2 text-sm">{item.target}</td>
		{/if}
		<td class="border border-gray-300 px-3 py-2 text-sm">{item.owner}</td>
		<td class="border border-gray-300 px-3 py-2 text-sm">{item.hits}</td>
		{#if edit}
			<td class="border border-gray-300 px-3 py-2">
				<label class="flex items-center gap-1 text-sm">
					<input type="checkbox" bind:checked={editItem.priv} class="h-4 w-4" />
					Private
				</label>
			</td>
		{:else}
			<td class="border border-gray-300 px-3 py-2 text-center">{item.priv ? '🔒' : '🌐'}</td>
		{/if}
		{#if edit}
			<td class="border border-gray-300 px-3 py-2">
				<div class="flex gap-1">
					<form method="POST" action="?/update">
						<input type="hidden" value={item.key} name="oldKey" />
						<input type="hidden" value={editItem.key} name="key" />
						<input type="hidden" value={editItem.target} name="target" />
						<input type="hidden" value={editItem.priv} name="priv" />
						<button class="rounded bg-gray-300 px-2 py-1 text-sm active:bg-gray-400">Save</button>
					</form>
					<button
						class="rounded bg-red-300 px-2 py-1 text-sm active:bg-red-400"
						onclick={() => {
							edit = false;
							editItem = item;
						}}
					>
						Cancel
					</button>
				</div>
			</td>
		{:else if editable}
			<td class="border border-gray-300 px-3 py-2">
				<div class="flex gap-1">
					<button
						class="rounded bg-gray-300 px-2 py-1 text-sm active:bg-gray-400"
						onclick={() => {
							edit = true;
						}}
					>
						Edit
					</button>
					<form method="POST" action="?/delete">
						<input type="hidden" value={item.key} name="key" />
						<button class="rounded bg-red-300 px-2 py-1 text-sm active:bg-red-400">Delete</button>
					</form>
				</div>
			</td>
		{/if}
	</tr>
{/if}
