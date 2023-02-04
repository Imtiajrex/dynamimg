import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	build: {
		sourcemap: false,
		rollupOptions: {
			cache: false
		}
	}
};

export default config;
