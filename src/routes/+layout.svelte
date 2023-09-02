<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import '../app.css';
	import GAnalytics from './GAnalytics.svelte';

	onMount(async () => {
		if (!dev) {
			const { inject } = await import('@vercel/analytics');

			inject();
		}
	});
</script>

<slot />

{#if !dev}
	<GAnalytics />
{/if}
