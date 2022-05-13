import * as utils from '@pixi/utils'
import { Renderer, BatchRenderer } from '@pixi/core'

export { utils }
export * from '@pixi/constants'
export * from '@pixi/math'
export * from '@pixi/runner'
export * from '@pixi/settings'
export * from '@pixi/ticker'
export * from '@pixi/core'

Renderer.registerPlugin('batch', BatchRenderer)
