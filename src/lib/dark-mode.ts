import { writable } from 'svelte/store';

export const state = writable(false);

state.subscribe((v) => {
	if ('document' in globalThis)
		if (v) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			document.head.querySelector<HTMLLinkElement>('[rel=icon]')!.href = '/favicon-dark.png';
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			document.head.querySelector<HTMLLinkElement>('[rel=icon]')!.href = '/favicon.png';
		}
});
