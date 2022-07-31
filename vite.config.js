import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	esbuild: {
		banner: {
			js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
		},
	},
};

export default config;
