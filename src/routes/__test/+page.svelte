<script lang="ts">
	import { selfQr } from '../../lib/selfQrData';
	import { page } from '$app/stores';

	const res = fetch($page.url.origin + '/api/image', {
		method: 'POST',
		body: JSON.stringify({ name: selfQr }),
	}).then((r) => r.json());
</script>
