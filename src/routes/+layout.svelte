<script lang="ts">
	import { browser } from '$app/environment';
	import '$lib/pre.scss';
	import '$lib/tailwind.scss';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (browser) {
			const { inject } = await import('@vercel/analytics');
			inject();
		}
	});
</script>

<slot />

<style lang="scss" global>
	.dark .prose {
		--tw-prose-headings: #fff;
	}

	.dark .prose code {
		background-color: #282c34;
		color: #abb2bf;
		border-radius: 4px;
		padding: 3px 6px;

		&::before,
		&::after {
			content: '';
		}
	}

	.prose code {
		background-color: #eaeaeb;
		color: #383a42;
		border-radius: 4px;
		padding: 3px 6px;
		transition: background-color 0.5s, color 0.5s;

		&::before,
		&::after {
			content: '';
		}
	}

	body {
		transition: background-color 0.5s, color 0.5s;
	}
</style>
