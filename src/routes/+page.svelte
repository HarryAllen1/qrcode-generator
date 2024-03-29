<script lang="ts">
	import DarkModeSwitch from '$lib/DarkModeSwitch.svelte';
	import GithubIcon from '$lib/GithubIcon.svelte';
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions,
		Switch,
		SwitchGroup,
		SwitchLabel,
		Transition,
	} from '@rgossiaux/svelte-headlessui';
	import { classNames } from '$lib/class-names';
	import iro from '@jaames/iro';
	import { onMount } from 'svelte';
	import ActionButtons from './ActionButtons.svelte';
	import { API_ROOT } from '$lib/constants';
	import Dialog, { openModal } from '$lib/Dialog.svelte';
	import { page } from '$app/stores';
	import { selfQr } from '$lib/selfQrData';

	$: rawData = new Response();

	let oldImage = selfQr;

	// array of objects for future use and also to easier copy paste from example
	const format = [
		{ format: 'png' },
		{ format: 'jpg' },
		{ format: 'webp' },
		{ format: 'gif' },
		{ format: 'svg' },
	];

	const errorCorrectionLevel = [
		{ name: 'Low', value: 'L' },
		{ name: 'Medium', value: 'M' },
		{ name: 'Quartile', value: 'Q' },
		{ name: 'High', value: 'H' },
	];

	const actualPage = $page;
	const textParam = actualPage.url.searchParams.get('text');

	$: url = textParam ?? `https://generate-qr.codes/`;
	$: selectedFormat = format[0];
	$: margin = 4;
	$: resolution = 1080;
	$: transparentBackground = false;
	$: foregroundColor = '#000000';
	$: backgroundColor = '#ffffff';
	$: selectedErrorCorrectionLevel = errorCorrectionLevel[1];

	let message: string;

	$: qrData = fetch(`${actualPage.url.origin}${API_ROOT}`, {
		method: 'POST',
		body: JSON.stringify({
			format: selectedFormat.format,
			margin: (margin || 4).toString(),
			size: (resolution || 1080).toString(),
			foreground: foregroundColor.substring(1),
			background: backgroundColor.substring(1),
			text: encodeURIComponent(url || 'https://generate-qr.codes/'),
			errorCorrection: selectedErrorCorrectionLevel.value ?? 'M',
		}),
	}).then(async (res) => {
		rawData = res;
		return await res.json();
	});

	$: if (rawData.status !== 200) {
		qrData.then((d) => {
			message = d.message;
		});
	}

	let foregroundPickerEl: HTMLDivElement;
	let foregroundIroColorPicker: iro.ColorPicker;

	let backgroundPickerEl: HTMLDivElement;
	let backgroundIroColorPicker: iro.ColorPicker;

	onMount(() => {
		foregroundIroColorPicker =
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			new iro.ColorPicker(foregroundPickerEl, {
				color: '#000',
				width: 225,
				borderWidth: 2,
				wheelLightness: false,
				layoutDirection: 'horizontal',
			});

		foregroundColor = foregroundIroColorPicker.color.hexString;

		foregroundIroColorPicker.on('color:change', (color: iro.Color) => {
			foregroundColor = color.hexString;
		});

		backgroundIroColorPicker =
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			new iro.ColorPicker(backgroundPickerEl, {
				color: '#fff',
				width: 225,
				borderWidth: 2,
				wheelLightness: false,
				layoutDirection: 'horizontal',
			});

		backgroundColor = backgroundIroColorPicker.color.hexString;

		backgroundIroColorPicker.on('color:change', (color: iro.Color) => {
			backgroundColor = color.hexString;
			transparentBackground = false;
		});
	});
	$: if (foregroundIroColorPicker) {
		foregroundIroColorPicker.color.hexString = foregroundColor;
	}

	// let imageUploadButton: HTMLInputElement;
	// let fileName = '';
</script>

<svelte:head>
	<meta
		property="og:image"
		content={`${actualPage.url.origin}/api/og?text=${encodeURIComponent(
			textParam ?? 'https://generate-qr.codes/'
		)}`}
	/>
</svelte:head>

<h1 class="text-black dark:text-white">QR Code Generator</h1>
<DarkModeSwitch />
<div class="flex flex-col md:flex-row md:space-x-4 md:space-y-4">
	<div class="flex flex-col">
		{#await qrData}
			<img
				class="w-96 pixelated shadow-md"
				id="placeholder-image"
				src={oldImage}
				alt="placeholder"
				width="384"
				height="384"
			/>
			<ActionButtons disabled />
		{:then image}
			{#if message}
				<p
					class="text-black my-8 bg-white text-4xl font-bold w-96 h-96 flex text-center justify-center items-center"
				>
					{message}
				</p>
				<ActionButtons disabled />
			{:else}
				<img
					class="w-96 pixelated shadow-md"
					id="qr-image"
					width="384"
					height="384"
					src={!image.data
						? '/placeholder.png'
						: image.type === 'svg'
						? image.asDataURL
						: image.data}
					alt="qrcode"
					on:load={() => {
						oldImage = !image.data
							? '/placeholder.png'
							: image.type === 'svg'
							? image.asDataURL
							: image.data;
					}}
				/>
				<ActionButtons
					extension={image.type}
					uri={image.type === 'svg' ? image.asDataURL : image.data}
				/>
			{/if}
		{:catch e}
			<p
				class="text-black my-8 bg-white text-4xl font-bold w-96 h-96 flex text-center justify-center items-center"
			>
				{e.message}
			</p>
			<ActionButtons disabled />
		{/await}
	</div>
	<div>
		<h2 class="mt-2 dark:text-white">Options</h2>

		<p class="mb-1">
			Text/URL <button
				class="text-gray-500"
				aria-label="More info"
				on:click={() => ($openModal = 'text')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<Dialog open={$openModal === 'text'} title="Text/URL">
				This is the info that makes up the QR code. Doesn't have to be a URL.
			</Dialog>
		</p>
		<input
			id="text-input"
			bind:value={url}
			type="text"
			spellcheck={false}
			placeholder="URL"
			class="input dark:bg-gray-800 dark:text-slate-300"
		/>

		<p class="mb-1">
			Image Format <button
				class="text-gray-500"
				aria-label="More info"
				on:click={() => ($openModal = 'format')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<Dialog open={$openModal === 'format'} title="Image Format">
				<ul>
					<li>
						PNG <ul><li>Good for basically anything</li></ul>
					</li>
					<li>
						JPG <ul><li>Better for printing</li></ul>
					</li>
					<li>
						WEBP <ul>
							<li>
								Great for websites, but lacks compatibility with other programs.
							</li>
						</ul>
					</li>
					<li>
						AVIF <ul>
							<li>
								Currently unsupported due to too slow processing, often
								resulting in timeouts.
							</li>
						</ul>
					</li>
					<li>
						GIF
						<ul>
							<li>Good for animations. Except QR codes don't animate.</li>
						</ul>
					</li>
					<li>
						SVG
						<ul>
							<li>
								Provides the highest quality, but only works in very certain
								scenarios. Great for editing vector graphics and posters.
							</li>
						</ul>
					</li>
				</ul>
			</Dialog>
		</p>
		<div class="mb-6 w-72 relative" id="image-format">
			<Listbox
				value={selectedFormat}
				on:change={(e) => (selectedFormat = e.detail)}
			>
				<div class="relative mt-1">
					<ListboxButton
						class="image-format-btn relative w-72 py-2 pl-3 pr-10 text-left bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
					>
						<span class="block truncate">{selectedFormat.format}</span>
						<span
							class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
						>
							<svg
								class="w-5 h-5 text-gray-400"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</span>
					</ListboxButton>
					<Transition
						enter="transition ease-out duration-100"
						enterFrom="opacity-0"
						enterTo="opacity-100"
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
												? 'text-blue-900 dark:text-blue-300 bg-blue-100 dark:bg-blue-900'
												: 'text-black dark:text-white'
										}`}
									value={person.format}
									let:selected
								>
									<span
										class={`block truncate ${
											selected ? 'font-bold' : 'font-normal'
										}`}
									>
										{person.format}
									</span>
									{#if selected}
										<span
											class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500"
										>
											<svg
												class="w-5 h-5"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												aria-hidden="true"
											>
												<path
													fill-rule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
										</span>
									{/if}
								</ListboxOption>
							{/each}
						</ListboxOptions>
					</Transition>
				</div>
			</Listbox>
		</div>
		<p class="mb-1">
			Margin <button
				class="text-gray-500"
				aria-label="More info"
				on:click={() => ($openModal = 'margin')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<Dialog open={$openModal === 'margin'} title="Text/URL">
				This is the white (or other custom background color) around the sides of
				the QR code.
			</Dialog>
		</p>
		<input
			bind:value={margin}
			type="number"
			placeholder="Margin"
			class="input dark:bg-gray-800 dark:text-slate-300"
		/>
		<p class="mb-1">
			Image Resolution/Size <button
				class="text-gray-500"
				aria-label="More info"
				on:click={() => ($openModal = 'res')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<Dialog open={$openModal === 'res'} title="Text/URL">
				The quality of the image. Increase this number the larger the actual
				image will be.
			</Dialog>
		</p>
		<input
			bind:value={resolution}
			type="number"
			placeholder="Resolution"
			class="input dark:bg-gray-800 dark:text-slate-300"
		/>
		<details>
			<summary>Colors</summary>

			<p class="mb-2">Foreground Color</p>
			<div class="mb-4" bind:this={foregroundPickerEl} />

			<p class="mb-2">Background Color</p>
			<div class="mb-4" bind:this={backgroundPickerEl} />

			<div class="flex items-start mb-4">
				<SwitchGroup as="div" class="flex items-center space-x-4">
					<SwitchLabel class="text-black dark:text-white"
						>Transparent Background</SwitchLabel
					>
					<Switch
						as="button"
						checked={transparentBackground}
						on:change={(event) => {
							backgroundColor = event.detail ? '#0000' : '#fff';
							transparentBackground = event.detail;
						}}
						class={({ checked }) =>
							classNames(
								'relative inline-flex flex-shrink-0 h-6 border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline transition-colors ease-in-out duration-200',
								checked ? 'bg-blue-600' : 'bg-gray-400'
							)}
					>
						<span
							class={classNames(
								'inline-block w-5 h-5 bg-white rounded-full transform transition ease-in-out duration-200',
								transparentBackground ? 'translate-x-5' : 'translate-x-0'
							)}
						/>
					</Switch>
				</SwitchGroup>
			</div>
			{#if selectedFormat.format === 'jpg' && transparentBackground}
				<p class="w-72 text-gray-500 dark:text-gray-400 flex flex-row">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
						height="26"
					>
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clip-rule="evenodd"
						/>
					</svg>
					JPGs don't support transparent backgrounds, making the background black.
				</p>
			{/if}
		</details>
		<!-- <details>
			<summary> Icon </summary>

			<input
				id="image-upload"
				type="file"
				bind:this={imageUploadButton}
				on:change={(e) => {
					fileName = (e.currentTarget.files ?? [{ name: '' }])[0].name;
				}}
				hidden
				accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,.svg,image/avif,image/tiff"
			/>
			<label
				for="image-upload"
				class="mt-2 inline-flex disabled:opacity-60 disabled:saturate-0 mr-4 justify-center rounded-md border border-transparent bg-blue-200 dark:bg-blue-600 text-blue-900 dark:text-white px-4 py-2 text-sm font-medium hover:bg-blue-300 dark:hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
			>
				Choose Image
			</label>
			<p>
				{fileName || 'No image selected'}
			</p>
		</details> -->
		<details>
			<summary> Advanced </summary>

			<p class="mb-1">
				Error Correction Level <button
					class="text-gray-500"
					aria-label="More info"
					on:click={() => ($openModal = 'err correction')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				<Dialog open={$openModal === 'err correction'} title="Text/URL">
					This value represents the amount of the non-critical parts of the QR
					code that can be covered, while keeping the QR code functional.
					Increasing this value also decreases the amount of data that can be
					stored in the QR code.
				</Dialog>
			</p>
			<div class="mb-6 w-72 relative">
				<Listbox
					value={selectedErrorCorrectionLevel}
					on:change={(e) => (selectedErrorCorrectionLevel = e.detail)}
				>
					<div class="relative mt-1">
						<ListboxButton
							class="relative w-72 py-2 pl-3 pr-10 text-left bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
						>
							<span class="block truncate"
								>{selectedErrorCorrectionLevel.name}</span
							>
							<span
								class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
									class="w-5 h-5 text-gray-400"
								>
									<path
										fill-rule="evenodd"
										d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
										clip-rule="evenodd"
									/>
								</svg>
							</span>
						</ListboxButton>
						<Transition
							enter="transition ease-out duration-100"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<ListboxOptions
								class="absolute w-full marker:!hidden pl-0 py-1 mt-1 overflow-auto text-base max-h-60 sm:text-sm rounded-lg border text-black dark:text-white border-white border-opacity-10 bg-white dark:bg-gray-900 bg-opacity-80 p-1 backdrop-blur backdrop-filter focus-visible:outline-none focus-visible:ring"
							>
								{#each errorCorrectionLevel as person, personIdx (personIdx)}
									<ListboxOption
										class={({ active }) =>
											`cursor-default select-none relative py-2 pl-10 pr-4 ${
												active
													? 'text-blue-900 dark:text-blue-300 bg-blue-100 dark:bg-blue-900'
													: 'text-black dark:text-white'
											}`}
										value={person.name}
										let:selected
									>
										<span
											class={`block truncate ${
												selected ? 'font-bold' : 'font-normal'
											}`}
										>
											{person.name}
										</span>
										{#if selected}
											<span
												class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500"
											>
												<svg
													class="w-5 h-5"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clip-rule="evenodd"
													/>
												</svg>
											</span>
										{/if}
									</ListboxOption>
								{/each}
							</ListboxOptions>
						</Transition>
					</div>
				</Listbox>
			</div>
		</details>
	</div>
</div>
<p class="prose-sm">
	<a href="/api" class="text-slate-400 dark:text-gray-400">QR Code API</a>
</p>
<GithubIcon />

<style lang="scss">
	.pixelated {
		image-rendering: pixelated;
	}
	::marker {
		display: none;
	}
</style>
