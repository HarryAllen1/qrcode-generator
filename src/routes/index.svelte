<script lang="ts">
	import { page } from '$app/stores';
	let data: Promise<{
		png: string;
		jpeg: string;
		webp: string;
		svg: string;
		avif: string;
	}> = fetch(
		new URL($page.url.href + 'generateQrcode?url=' + encodeURIComponent('https://google.com/'))
	).then(async (res) => await res.json()) as any;
</script>

<h1>QR Code Generator</h1>

{#await data then svg}
	{#if svg.svg.startsWith('<svg')}
		{@html svg.svg}
	{/if}
	<img src="data:image/png;base64,{svg.png}" />
	<img src="data:image/avif;base64,{svg.avif}" />
	<img src="data:image/jpeg;base64,{svg.jpeg}" />
	<img src="data:image/webp;base64,{svg.webp}" />
{:catch}
	<p>malformed url</p>
{/await}

<style lang="scss">
	@import 'tailwindcss/base';
	@import 'tailwindcss/components';
	@import 'tailwindcss/utilities';
</style>
