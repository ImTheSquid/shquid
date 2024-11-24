<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';

	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let isSquished = false;

	const squish = () => {
		isSquished = true;
		setTimeout(() => {
			isSquished = false;
		}, 500); // Controls how long the squid stays squished
	};
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

<div>
	<button onclick={(_) => signIn()}>SIGN IN</button>
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
