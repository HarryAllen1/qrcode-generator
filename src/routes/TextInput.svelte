<script lang="ts">
	import { url } from './data';

	export let type = '';

	// let encryption: 'WPA' | 'WEP' | 'None' = 'None';

	$: ssid = '';
	$: password = '';
	$: hidden = false;
	$: type = 'WPA';

	$: $url = `WIFI:T:${type === 'None' ? 'nopass' : type};S:${ssid
		.replaceAll(':', '\\:')
		.replaceAll('\\', '\\\\')
		.replaceAll(';', '\\;')};P:${password};H:${hidden}`;
</script>

{#if (type = 'wifi')}
	<input
		bind:value={ssid}
		type="number"
		placeholder="Margin"
		class="input dark:bg-gray-800 dark:text-slate-300"
	/>
{/if}
