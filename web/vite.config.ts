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
  esbuild: { drop: mode === 'development' ? [] : ['console', 'debugger'] },
  server: { fs: { allow: ['../lib/pkg'] } },
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
        autoprefixer(),
        ...(mode === 'development'
          ? []
          : [
              cssnano({
                preset: advancedPreset({
                  convertValues: { length: true },
                  discardComments: { removeAll: true },
                  discardUnused: { fontFace: false }
                })
              })
            ])
      ]
    }
  }
}))
