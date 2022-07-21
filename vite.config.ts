import { sveltekit } from '@sveltejs/kit/vite'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import advancedPreset from 'cssnano-preset-advanced'
import tailwindcss from 'tailwindcss'
import nesting from 'tailwindcss/nesting/index.js'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'

export default defineConfig(({ mode }) => ({
  clearScreen: false,
  envPrefix: 'GOLEM_',
  plugins: [wasm(), topLevelAwait(), sveltekit()],
  optimizeDeps: {
    include: ['pixi.js'],
    exclude: ['golem', 'svelte-pixi']
  },
  css: {
    postcss: {
      plugins: [
        nesting(),
        tailwindcss() as any,
        autoprefixer(),
        ...(mode === 'production'
          ? [
              cssnano({
                preset: advancedPreset({
                  convertValues: { length: true },
                  discardComments: { removeAll: true }
                })
              })
            ]
          : [])
      ]
    }
  }
}))
