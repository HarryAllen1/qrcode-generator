<script lang="ts">
	import { downloadURI } from '$lib/download';

	export let disabled = false;
	export let uri = '';
	export let extension = '';
</script>

<div class="flex flex-row">
	<button
		type="button"
		{disabled}
		on:click={() => {
			downloadURI(uri ?? '', `qrcode.${extension}`);
		}}
		class="inline-flex disabled:opacity-60 disabled:saturate-0 mr-4 justify-center rounded-md border border-transparent bg-blue-200 dark:bg-blue-600 text-blue-900 dark:text-white px-4 py-2 text-sm font-medium hover:bg-blue-300 dark:hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 mr-2"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
		Download
	</button>
	<button
		type="button"
		{disabled}
		on:click={async () => {
			const res = await fetch(uri ?? '');
			const blob = await res.blob();

			navigator.clipboard.write([
				new window.ClipboardItem({
					[`image/${extension}`]: blob,
				}),
			]);
		}}
		class="inline-flex disabled:opacity-60 disabled:saturate-0 mr-4 justify-center rounded-md border border-transparent bg-blue-200 dark:bg-blue-600 text-blue-900 dark:text-white px-4 py-2 text-sm font-medium hover:bg-blue-300 dark:hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 mr-2"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
			<path
				d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z"
			/>
		</svg>
		Copy
	</button>
</div>
