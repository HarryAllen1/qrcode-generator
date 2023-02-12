<script lang="ts">
	import { browser, dev } from '$app/environment';
	import '$lib/pre.scss';
	import '$lib/tailwind.scss';
	import { onMount } from 'svelte';
	import './global.scss';

	onMount(async () => {
		if (browser && !dev) {
			const { inject } = await import('@vercel/analytics');
			inject();
		}
	});
</script>

<slot />
