import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	esbuild: {
		banner: {
			js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
		},
	},
});
