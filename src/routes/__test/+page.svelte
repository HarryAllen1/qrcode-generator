<script>
	import Page from '../+page.svelte';
</script>

<!-- <script lang="ts">
	import { selfQr } from '../../lib/selfQrData';
	import { page } from '$app/stores';

	const res = fetch($page.url.origin + '/api/image', {
		method: 'POST',
		body: JSON.stringify({ qrCodeImageDataURL: selfQr, width: 1080 }),
	}).then((r) => r.json());
</script>

{#await res then data}
	<img src={data.imageDataURL} alt="QR code" />
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await} -->

<Page />
