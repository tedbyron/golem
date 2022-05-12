import path from 'path'

import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    // TODO: adapter-static SPA mode
    adapter: adapter(),
    csp: {
      directives: {
        'base-uri': ['self'],
        'object-src': ['none'],
        'script-src': ['self']
      }
    },
    vite: {
      envPrefix: 'GOLEM_',
      resolve: {
        alias: {
          $routes: path.resolve('src', 'routes'),
          $stores: path.resolve('src', 'stores')
        }
      }
    }
  }
}

export default config
