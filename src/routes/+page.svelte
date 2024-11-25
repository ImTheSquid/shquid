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

<div class="m-4 flex items-center justify-center">
	<div class="flex flex-col items-center lg:w-1/2">
		<button class="m-2 flex items-center justify-center text-center text-5xl" onclick={squish}>
			<span class="arrow {isSquished ? 'squish' : ''}">➡️</span>
			<span
				class="squid {isSquished ? 'squish' : ''}"
				transition:scale={{ duration: 200, easing: cubicOut }}
			>
				🦑
			</span>
			<span class="arrow {isSquished ? 'squishr' : ''}">⬅️</span>
		</button>

		<h2 class="text-3xl">SQUISH some links with IMSQU.ID</h2>

		{#if ownerId}
			{#if !links}
				<h4 class="text-3xl text-red-500">
					ERROR! INVALID LOGIN! Either you used GitHub login (only the owner can) or your passport
					is not trusted.
				</h4>
				<p>Sign out to see links, contact Jack to be added to the trusted list</p>
			{/if}
			<button onclick={() => signOut()} class="m-1 rounded bg-gray-300 p-1">SIGN OUT</button>
		{:else}
			<button onclick={() => signIn()} class="m-1 rounded bg-gray-300 p-1">SIGN IN</button>
		{/if}

		{#if ownerId}
			{#if links}
				<h3 class="mt-3 text-2xl font-bold">My Links</h3>
				<Table links={links.filter((l) => l.owner === ownerId)} editable={true} />
			{/if}

			<div class="mt-3 rounded border border-blue-300 p-1">
				<form method="POST" action="?/create">
					<h3 class="text-2xl font-bold">Create New Link</h3>
					<label for="key">Key:</label>
					<input class="border" id="key" name="key" bind:value={newKey} />
					{#if free !== null}
						<span>{free ? '✅' : '❌'}</span>
					{/if}
					<label for="target">Target:</label>
					<input class="border" id="target" name="target" bind:value={newTarget} />
					<label for="priv"> Private?: </label>
					<input id="priv" name="priv" type="checkbox" />
					<button
						class="rounded bg-gray-300 p-1 disabled:bg-gray-100"
						disabled={newTarget.length === 0 || newKey.length === 0 || !(free ?? false)}>Add</button
					>
				</form>
			</div>
		{/if}

		<h3 class="mt-3 text-2xl font-bold">{isAdmin ? 'All' : 'Public'} Links</h3>
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
