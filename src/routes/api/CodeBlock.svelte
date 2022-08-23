<script lang="ts">
	import { getHighlighter, setCDN, type Theme } from 'shiki';
	import { state } from '$lib/DarkModeSwitch.svelte';

	setCDN('https://unpkg.com/shiki/');

	export let lang = 'ts';
	export let darkTheme: Theme = 'one-dark-pro';
	export let lightTheme: Theme = 'github-light';
	export let input = `console.log('Hello, World!')`;

	let code = 'Loading...';

	$: {
		getHighlighter({ theme: $state ? darkTheme : lightTheme })
			.then((highlighter) => {
				code = highlighter.codeToHtml(input, { lang, theme: $state ? darkTheme : lightTheme });
			})
			.catch((err) => {
				console.log(err);
			});
	}
</script>

{@html code}
