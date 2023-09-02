import { writable } from 'svelte/store';

export const qrcode = writable<string | null>(null);

type ImageFormat = 'png' | 'svg' | 'webp' | 'jpeg' | 'avif';
type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';

interface Options {
	text: string;
	format: ImageFormat;
	margin: number;
	resolution: number;
	color: {
		foreground: string;
		/**
		 * transparent if false
		 */
		background: string | false;
	};
	errorCorrection: ErrorCorrection;
}

export const options = writable<Options>({
	text: 'https://qrcodes.harryallen.dev',
	format: 'png',
	margin: 4,
	resolution: 72,
	color: {
		foreground: '#000000',
		background: '#ffffff',
	},
	errorCorrection: 'M',
});
