import adapter from '@sveltejs/adapter-cloudflare'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({ postcss: true }),
  kit: {
    adapter: adapter(),
    prerender: { default: true },
    alias: {
      'pixi.js': 'src/lib/pixi.ts',
      $components: 'src/components',
      $routes: 'src/routes',
      $stores: 'src/stores'
    }
  }
}

export default config
