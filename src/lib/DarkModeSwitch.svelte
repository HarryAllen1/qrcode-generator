<script lang="ts">
	import { Switch, SwitchGroup, SwitchLabel } from '@rgossiaux/svelte-headlessui';
	import { onMount } from 'svelte';

	function classNames(...classes: (string | false | null | undefined)[]) {
		return classes.filter(Boolean).join(' ');
	}

	function update() {
		localStorage.theme = state ? 'dark' : 'light';

		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark', 'changing-theme');
		} else {
			document.documentElement.classList.remove('dark', 'changing-theme');
		}
		window.setTimeout(() => {
			document.documentElement.classList.remove('changing-theme');
		});
	}

	$: state = false;

	onMount(() => {
		state = document.documentElement.classList.contains('dark');
	});
</script>

<div class="flex items-start justify-center w-screen mb-4">
	<SwitchGroup as="div" class="flex items-center space-x-4">
		<SwitchLabel class="text-black dark:text-white">Dark Mode</SwitchLabel>
		<Switch
			as="button"
			checked={state}
			on:change={(event) => {
				state = event.detail;
				update();
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
