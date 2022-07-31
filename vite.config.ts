import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	esbuild: {
		banner:
			"import { createRequire as __createRequire } from 'module';const require = __createRequire(import.meta.url);",
	},
});
