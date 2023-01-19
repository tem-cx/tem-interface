import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	// enable cors
	server: {
		cors: true
	},
	resolve: {
		alias: {
			zlib: 'browserify-zlib'
		}
	}
};

export default config;
