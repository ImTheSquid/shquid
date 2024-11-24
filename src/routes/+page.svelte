<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';

	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { Session } from '@auth/sveltekit';
	import type { IDSession } from '../types';
	import type { Link } from '$lib';

	let isSquished = $state(false);

	const squish = () => {
		isSquished = true;
		setTimeout(() => {
			isSquished = false;
		}, 500); // Controls how long the squid stays squished
	};

	const { session, links }: { session?: Session | IDSession; links?: Link[] } = $props();
</script>

<button class="flex items-center justify-center text-center text-5xl" onclick={squish}>
	<span class="arrow {isSquished ? 'squish' : ''}">➡️</span>
	<span
		class="squid {isSquished ? 'squish' : ''}"
		transition:scale={{ duration: 200, easing: cubicOut }}
	>
		🦑
	</span>
	<span class="arrow {isSquished ? 'squishr' : ''}">⬅️</span>
</button>

<p>SQUISH some links with IMSQU.ID</p>

{#if session}
	{#if !links}
		<h4 class="text-3xl text-red-500">
			ERROR! INVALID LOGIN! Either you used GitHub login (only the owner can) or your passport is
			not trusted.
		</h4>
		<p>Sign out to see links, contact Jack to be added to the trusted list</p>
	{/if}
	<button onclick={() => signOut()}>SIGN OUT</button>
{:else}
	<button onclick={() => signIn()}>SIGN IN</button>
{/if}

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
