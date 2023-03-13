import { sveltekit } from '@sveltejs/kit/vite'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import advancedPreset from 'cssnano-preset-advanced'
import tailwindcss from 'tailwindcss'
import nesting from 'tailwindcss/nesting'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'

export default defineConfig(({ mode }) => ({
  plugins: [wasm(), topLevelAwait(), sveltekit()],
  optimizeDeps: {
    include: ['pixi.js'],
    exclude: ['golem']
  },
  css: {
    postcss: {
      plugins: [
        nesting(),
        tailwindcss(),
        ...(mode === 'production'
          ? [
              cssnano({
                preset: advancedPreset({
                  autoprefixer: { add: true },
                  convertValues: { length: true },
                  discardComments: { removeAll: true }
                })
              })
            ]
          : [autoprefixer()])
      ]
    }
  }
}))
