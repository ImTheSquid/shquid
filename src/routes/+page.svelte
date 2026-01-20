<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';

	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { PageData } from './$types';
	import Table from '$lib/Table.svelte';

	function debounce<
		T extends (...args: /* eslint-disable  @typescript-eslint/no-explicit-any */ any[]) => void
	>(func: T, delay: number): (...args: Parameters<T>) => void {
		let timeout: number;
		return (...args: Parameters<T>) => {
			window.clearTimeout(timeout);
			timeout = window.setTimeout(() => func(...args), delay);
		};
	}

	let isSquished = $state(false);

	const squish = () => {
		isSquished = true;
		setTimeout(() => {
			isSquished = false;
		}, 500); // Controls how long the squid stays squished
	};

	const { data }: { data: PageData } = $props();
	const { ownerId, links, isAdmin } = data;

	let newKey: string = $state('');
	let newTarget: string = $state('');
	let free: boolean | null = $state(null);

	const freeCheck = debounce(async (k: string) => {
		if (newKey.length === 0) {
			free = null;
			return;
		}
		const req = await fetch(`/api/free?key=${k}`);
		const j: { free: boolean } = await req.json();
		free = j.free;
	}, 400);

	$effect(() => {
		freeCheck(newKey);
	});
</script>

<div class="mx-auto w-full max-w-4xl px-4 py-4 sm:px-6">
	<div class="flex flex-col items-center">
		<button
			class="m-2 flex items-center justify-center text-center text-3xl sm:text-5xl"
			onclick={squish}
		>
			<span class="arrow {isSquished ? 'squish' : ''}">➡️</span>
			<span
				class="squid {isSquished ? 'squish' : ''}"
				transition:scale={{ duration: 200, easing: cubicOut }}
			>
				🦑
			</span>
			<span class="arrow {isSquished ? 'squishr' : ''}">⬅️</span>
		</button>

		<h2 class="text-center text-xl sm:text-3xl">SQUISH some links with IMSQU.ID</h2>

		{#if ownerId}
			<button
				onclick={() => signOut()}
				class="m-2 rounded bg-gray-300 px-4 py-2 text-base active:bg-gray-400">SIGN OUT</button
			>
		{:else}
			{#if !links}
				<h4 class="px-2 text-center text-lg text-red-500 sm:text-xl">
					ERROR! INVALID LOGIN! Either you used GitHub login (only the owner can) or your passport
					is not trusted.
				</h4>
				<p class="px-2 text-center">
					Sign out to see links, contact Jack to be added to the trusted list
				</p>
			{/if}
			<button
				onclick={() => signIn()}
				class="m-2 rounded bg-gray-300 px-4 py-2 text-base active:bg-gray-400">SIGN IN</button
			>
		{/if}

		{#if ownerId}
			{#if links}
				<h3 class="mt-4 text-xl font-bold sm:text-2xl">My Links</h3>
				<Table links={links.filter((l) => l.owner === ownerId)} editable={true} />
			{/if}

			<div class="mt-4 w-full rounded border border-blue-300 p-3 sm:p-4">
				<form method="POST" action="?/create" class="flex flex-col gap-3">
					<h3 class="text-center text-xl font-bold sm:text-2xl">Create New Link</h3>
					<div class="flex flex-col gap-1">
						<label for="key" class="font-medium">Key:</label>
						<div class="flex items-center gap-2">
							<input
								class="flex-1 rounded border px-3 py-2 text-base"
								id="key"
								name="key"
								bind:value={newKey}
							/>
							{#if free !== null}
								<span class="text-xl">{free ? '✅' : '❌'}</span>
							{/if}
						</div>
					</div>
					<div class="flex flex-col gap-1">
						<label for="target" class="font-medium">Target:</label>
						<input
							class="w-full rounded border px-3 py-2 text-base"
							id="target"
							name="target"
							bind:value={newTarget}
						/>
					</div>
					<div class="flex items-center gap-2">
						<input id="priv" name="priv" type="checkbox" class="h-5 w-5" />
						<label for="priv" class="font-medium">Private?</label>
					</div>
					<button
						class="w-full rounded bg-gray-300 px-4 py-3 text-base font-medium active:bg-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
						disabled={newTarget.length === 0 || newKey.length === 0 || !(free ?? false)}
						>Add Link</button
					>
				</form>
			</div>
		{/if}

		<h3 class="mt-4 text-xl font-bold sm:text-2xl">{isAdmin ? 'All' : 'Public'} Links</h3>
		{#if links}
			<Table links={links.filter((l) => l.owner !== ownerId)} editable={isAdmin} />
		{/if}
	</div>
</div>

<style>
	.arrow {
		display: inline-block;
		transition: transform 0.2s ease; /* Smooth arrow movement */
	}

	.arrow.squish {
		transform: translateX(1rem); /* Move arrows inward */
	}

	.arrow.squishr {
		transform: translateX(-1rem);
	}

	.squid {
		display: inline-block;
		transition: transform 0.2s ease; /* Smooth squid squishing */
		transform-origin: center;
	}

	.squid.squish {
		transform: scaleX(0.4); /* Horizontal squish */
	}
</style>
