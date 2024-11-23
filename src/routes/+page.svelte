<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
</script>

<h1 class="text-4xl">➡️🦑⬅️</h1>
<p>SQUISH some links with IMSQU.ID</p>

<div>
	<button onclick={(_) => signIn()}>SIGN IN</button>
</div>
