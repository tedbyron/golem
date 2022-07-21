import { Application } from '@pixi/app'
import { Renderer, BatchRenderer } from '@pixi/core'
import * as PIXI from '@pixi/core'
import { TickerPlugin } from '@pixi/ticker'
import * as utils from '@pixi/utils'

if (import.meta.env.DEV) {
  import('@pixi/unsafe-eval').then(({ install }) => install(PIXI)).catch(console.error)
}

export { utils }
export * from '@pixi/app'
export * from '@pixi/constants'
export * from '@pixi/core'
export * from '@pixi/display'
export * from '@pixi/graphics'
export * from '@pixi/math'
export * from '@pixi/particle-container'
export * from '@pixi/runner'
export * from '@pixi/settings'
export * from '@pixi/ticker'

Renderer.registerPlugin('batch', BatchRenderer)
Application.registerPlugin(TickerPlugin)
