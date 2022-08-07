<script lang="ts">
	import { page } from '$app/stores';
	import DarkModeSwitch from '$lib/DarkModeSwitch.svelte';
	import GithubIcon from '$lib/GithubIcon.svelte';
	import CheckIcon from '$lib/icons/Check.svelte';
	import SelectorIcon from '$lib/icons/Selector.svelte';
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions,
		Popover,
		PopoverButton,
		PopoverPanel,
		Switch,
		SwitchGroup,
		SwitchLabel,
		Transition,
	} from '@rgossiaux/svelte-headlessui';
	import { classNames } from '../lib/class-names';
	import iro from '@jaames/iro';
	import ChevronDown from '../lib/icons/ChevronDown.svelte';
	import { onMount } from 'svelte';

	$: url = 'https://google.com/';

	let message = '';

	let data: Promise<{
		data: string;
		type: string;
		asDataURL: string;
		status: number;
		message: string;
	}> = fetch($page.url.origin + '/generateQrcode?format=webp&text=' + encodeURIComponent(url))
		.then(async (res) => {
			message = '';
			return await res.json();
		})
		.catch((e) => (message = e.toString())) as any;

	const format = [
		{ format: 'png' },
		{ format: 'jpg' },
		{ format: 'webp' },
		{ format: 'avif' },
		{ format: 'gif' },
		{ format: 'svg' },
		{ format: 'tiff' },
	];

	$: selectedFormat = format[0];
	$: margin = 4;
	$: resolution = 1080;
	$: transparentBackground = false;
	$: foregroundColor = '#000000';
	$: backgroundColor = '#ffffff';
	let transparentSliderDisabled = false;

	$: if (selectedFormat.format === 'jpg') {
		transparentBackground = false;
		transparentSliderDisabled = true;
	}

	$: data = fetch(
		$page.url.origin +
			`/generateQrcode?format=${selectedFormat.format}&margin=${margin || 4}&size=${
				resolution || 1080
			}&text=` +
			encodeURIComponent(url || 'https://google.com/')
	)
		.then(async (res) => {
			message = '';
			return await res.json();
		})
		.catch((e) => (message = e.toString())) as any;

	let foregroundPickerEl: HTMLDivElement;
	let iroColorPicker: iro.ColorPicker;

	onMount(() => {
		// @ts-ignore
		iroColorPicker = new iro.ColorPicker(foregroundPickerEl, {
			color: '#000',
			width: 300,
		});
	});
</script>

<h1 class="text-black dark:text-white">QR Code Generator</h1>
<GithubIcon />
<DarkModeSwitch />
<div class="flex flex-col md:flex-row md:space-x-4 md:space-y-4">
	<div>
		{#await data}
			<img class="w-96 pixelated shadow-md" src="/placeholder.png" alt="placeholder" />
		{:then image}
			{#if image.status === 400 || image.status === 500}
				<p class="w-96">{image.message}</p>
			{:else}
				<img
					class="w-96 pixelated shadow-md"
					src={!image.data
						? '/placeholder.png'
						: image.type === 'svg'
						? image.asDataURL
						: image.data}
					alt="qrcode"
				/>
			{/if}
		{:catch e}
			<p class="w-96">{e.message}</p>
		{/await}
	</div>
	<div>
		<h2 class="mt-2">Options</h2>
		<p class="mb-1">Text/URL</p>
		<input
			bind:value={url}
			type="text"
			spellcheck={false}
			placeholder="URL"
			class="input dark:bg-gray-800 dark:text-slate-300"
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
							class="absolute w-full marker:!hidden pl-0 py-1 mt-1 overflow-auto text-base max-h-60 sm:text-sm rounded-lg border text-black dark:text-white border-white border-opacity-10 bg-white dark:bg-gray-900 bg-opacity-80 p-1 backdrop-blur backdrop-filter focus-visible:outline-none focus-visible:ring"
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
			class="input dark:bg-gray-800 dark:text-slate-300"
		/>
		<p class="mb-1">Image Resolution/Size</p>
		<input
			bind:value={resolution}
			type="number"
			placeholder="Resolution"
			class="input dark:bg-gray-800 dark:text-slate-300"
		/>
		<details>
			<summary>Colors</summary>
			<p class="mb-0">Foreground Color</p>
			<div id="foreground-picker" class="mb-4" bind:this={foregroundPickerEl} />
			<div class="flex items-start mb-4">
				<SwitchGroup as="div" class="flex items-center space-x-4">
					<SwitchLabel class="text-black dark:text-white">Transparent Background</SwitchLabel>
					<Switch
						disabled={transparentSliderDisabled}
						as="button"
						checked={transparentBackground}
						on:change={(event) => {
							transparentBackground = event.detail;
						}}
						class={({ checked }) =>
							classNames(
								'relative inline-flex flex-shrink-0 h-6 border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline transition-colors ease-in-out duration-200',
								checked ? 'bg-blue-600' : 'bg-gray-400'
							)}
						let:checked
					>
						<span
							class={classNames(
								'inline-block w-5 h-5 bg-white rounded-full transform transition ease-in-out duration-200',
								checked ? 'translate-x-5' : 'translate-x-0'
							)}
						/>
					</Switch>
				</SwitchGroup>
			</div>
		</details>
	</div>
</div>
<h6><a href="/api" class="dark:text-gray-400">QR Code API</a></h6>

<style lang="scss">
	.pixelated {
		image-rendering: pixelated;
	}
	::marker {
		display: none;
	}

	:global(input.input) {
		@apply flex items-center w-72 mb-4 shadow-md text-left space-x-3 px-4 h-12 bg-white focus:outline-none focus:ring-2 rounded-lg text-black dark:ring-0;
	}
</style>
