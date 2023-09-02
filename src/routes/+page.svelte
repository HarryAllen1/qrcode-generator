<script lang="ts">
	import Options from './Options.svelte';
	import QrCode from './QRCode.svelte';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
</script>

<div class="flex flex-col items-center w-full p-8">
	<h1>QR Code Generator</h1>

	<ThemeSwitcher />

	<div class="grid grid-cols-2">
		<QrCode />
		<Options />
	</div>
</div>
