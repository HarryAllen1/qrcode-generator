<script lang="ts">
	import { page } from '$app/stores';
	import DarkModeSwitch from '$lib/DarkModeSwitch.svelte';

	$: url = 'https://google.com/';

	let data: Promise<{
		png: string;
		jpeg: string;
		webp: string;
		svg: string;
		avif: string;
	}> = fetch(new URL($page.url.href + 'generateQrcode?url=' + encodeURIComponent(url))).then(
		async (res) => await res.json()
	) as any;

	$: url,
		(data = fetch(new URL($page.url.href + 'generateQrcode?url=' + encodeURIComponent(url))).then(
			async (res) => await res.json()
		) as any);
</script>

<h1 class="text-black dark:text-white">QR Code Generator</h1>

<DarkModeSwitch />

<input
	bind:value={url}
	type="url"
	spellcheck={false}
	placeholder="URL"
	class="flex items-center w-72 mb-4 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-black dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
/>
<div>
	{#await data then images}
		<img class="w-72" src="data:image/webp;base64,{images.webp}" alt="qrcode" />
	{:catch}
		<p>malformed url</p>
	{/await}
</div>
