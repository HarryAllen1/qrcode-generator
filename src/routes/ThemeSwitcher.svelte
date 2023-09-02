<script lang="ts">
	import { browser } from '$app/environment';
	import { createSwitch, melt } from '@melt-ui/svelte';

	const {
		elements: { input, root },
		states: { checked },
	} = createSwitch();

	if (browser) {
		$checked = localStorage.getItem('theme') === 'dark';
		checked.subscribe((val) => {
			localStorage.setItem('theme', val ? 'dark' : 'light');
			document.documentElement.classList.toggle('dark', val);
		});
	}
</script>

<div class="flex items-center">
	<label for="theme-toggle" class="pr-4 leading-none"> Dark Mode </label>
	<button
		id="theme-toggle"
		class="relative h-6 w-11 cursor-default rounded-full bg-gray-400 transition-colors data-[state=checked]:bg-blue-600"
		use:melt={$root}
	>
		<span
			class="block h-5 w-5 translate-x-0.5 rounded-full bg-white
                transition-transform will-change-transform
                {$checked && 'translate-x-[22px]'}"
		/>
		<input use:melt={$input} />
	</button>
</div>
