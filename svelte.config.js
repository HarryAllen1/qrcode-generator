import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss: true,
		sourceMap: true,
	}),

	kit: {
		adapter: adapter({
			// cannot use sharp in edge functions :(
			edge: false,
		}),
	},
};

export default config;
