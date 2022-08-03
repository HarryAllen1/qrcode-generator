<script lang="ts">
	import { page } from '$app/stores';
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions,
		Transition,
	} from '@rgossiaux/svelte-headlessui';
	import { CheckIcon, SelectorIcon } from '@rgossiaux/svelte-heroicons/solid';
	import DarkModeSwitch from '$lib/DarkModeSwitch.svelte';

	$: url = 'https://google.com/';

	let data: Promise<{
		data: string;
		type: string;
		asDataURL: string;
	}> = fetch(
		new URL($page.url.href + 'generateQrcode?format=webp&text=' + encodeURIComponent(url))
	).then(async (res) => await res.json()) as any;

	const format = [
		{ format: 'png' },
		{ format: 'jpg' },
		{ format: 'webp' },
		{ format: 'avif' },
		{ format: 'gif' },
		{ format: 'svg' },
		{ format: 'tiff' },
	] as const;

	$: selectedFormat = format[0];
	$: margin = 4;

	$: url,
		selectedFormat,
		margin,
		(data = fetch(
			new URL(
				$page.url.href +
					`generateQrcode?format=${selectedFormat.format}&margin=${margin}&text=` +
					encodeURIComponent(url)
			)
		).then(async (res) => await res.json()) as any);
</script>

<h1 class="text-black dark:text-white">QR Code Generator</h1>

<DarkModeSwitch />
<div class="flex flex-col md:flex-row space-x-4 space-y-4">
	<div>
		{#await data}
			<p>loading qrcode....</p>
		{:then image}
			<img
				class="w-72 pixelated"
				src={image.type === 'svg' ? image.asDataURL : image.data}
				alt="qrcode"
			/>
		{:catch}
			<p>malformed url</p>
		{/await}
	</div>
	<div>
		<h2 class="mt-2">Options</h2>
		<p class="mb-1">Text</p>
		<input
			bind:value={url}
			type="url"
			spellcheck={false}
			placeholder="URL"
			class="flex items-center w-72 mb-4 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-black dark:bg-gray-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5"
		/>
		<p class="mb-1">Image Format</p>
		<div class="mb-6 relative">
			<Listbox value={selectedFormat} on:change={(e) => (selectedFormat = e.detail)}>
				<div class="relative mt-1">
					<ListboxButton
						class="relative w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-slate-800 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
					>
						<span class="block truncate">{selectedFormat.format}</span>
						<span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
							<SelectorIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
						</span>
					</ListboxButton>
					<Transition
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<ListboxOptions
							class="absolute w-full marker:!hidden pl-0 py-1 mt-1 overflow-auto text-base max-h-60 sm:text-sm rounded-lg border text-black dark:text-white border-white border-opacity-10 bg-gray-900 bg-opacity-80 p-1 backdrop-blur backdrop-filter focus-visible:outline-none focus-visible:ring"
						>
							{#each format as person, personIdx (personIdx)}
								<ListboxOption
									class={({ active }) =>
										`cursor-default select-none relative py-2 pl-10 pr-4 ${
											active
												? 'text-blue-900 bg-blue-100 dark:bg-blue-300'
												: 'text-black dark:text-white'
										}`}
									value={person}
									let:selected
								>
									<span class={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
										{person.format}
									</span>
									{#if selected}
										<span class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
											<CheckIcon class="w-5 h-5" aria-hidden="true" />
										</span>
									{/if}
								</ListboxOption>
							{/each}
						</ListboxOptions>
					</Transition>
				</div>
			</Listbox>
		</div>
		<p class="mb-1">Margin</p>
		<input
			bind:value={margin}
			type="number"
			placeholder="Margin"
			class="flex items-center w-72 mb-4 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-black dark:bg-gray-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5"
		/>
	</div>
</div>

<style lang="scss">
	.pixelated {
		image-rendering: pixelated;
	}
	::marker {
		display: none;
	}
</style>
