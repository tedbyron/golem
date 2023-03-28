<script lang="ts" context="module">
  import * as PIXI from 'pixi.js'

  PIXI.settings.GC_MODE = PIXI.GC_MODES.MANUAL
  PIXI.settings.RESOLUTION = window.devicePixelRatio
  PIXI.settings.ROUND_PIXELS = true
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  PIXI.utils.skipHello()

  /** Calculates automaton cell colors, and renders. */
  export let redraw: () => void
  /** Steps to the next generation, updates cell colors, and renders. */
  export let step: () => void
</script>

<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { Container, Renderer, Ticker } from 'svelte-pixi'

  import { cellSize, colors, cols, generation, height, numCells, rows, width } from '$lib'

  import type { Automaton } from 'golem'

  export let automaton: Automaton
  export let memory: WebAssembly.Memory

  let cellsView = new Uint8Array(memory.buffer, automaton.cellsPtr(), $numCells)
  let renderer: PIXI.Renderer | undefined
  let stage: PIXI.Container | undefined
  let sprites: PIXI.Sprite[] | undefined

  /** Destroys sprites and creates new ones based on the current state. */
  const draw = (rows: number, cols: number, cellSize: number) => {
    if (renderer === undefined || stage === undefined) {
      return
    }

    sprites?.forEach((sprite) => {
      sprite.destroy(true)
    })
    stage.removeChildren()

    cellsView = new Uint8Array(memory.buffer, automaton.cellsPtr(), $numCells)
    sprites = new Array($numCells)
    const templateShape = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, cellSize, cellSize)
      .endFill()
    const renderTexture = PIXI.RenderTexture.create({
      width: cellSize,
      height: cellSize,
      multisample: PIXI.MSAA_QUALITY.NONE,
    })
    renderer.render(templateShape, {
      renderTexture,
      transform: new PIXI.Matrix(1, 0, 0, 1),
    })
    renderer.framebuffer.blit()
    templateShape.destroy(true)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col

        sprites[i] = new PIXI.Sprite(renderTexture)
        sprites[i]!.position.set(col * cellSize, row * cellSize)
        sprites[i]!.tint = colors[cellsView[i]!]!
      }
    }

    stage.addChild(...sprites)
    renderer.render(stage)
  }

  const unsubNumCells = numCells.subscribe(() => {
    draw($rows, $cols, $cellSize)
  })
  const unsubCellSize = cellSize.subscribe((val) => {
    draw($rows, $cols, val)
  })
  const unsubRows = rows.subscribe((val) => {
    draw(val, $cols, $cellSize)
  })
  const unsubCols = cols.subscribe((val) => {
    draw($rows, val, $cellSize)
  })

  redraw = () => {
    cellsView = new Uint8Array(memory.buffer, automaton.cellsPtr(), $numCells)

    for (let row = 0; row < $rows; row++) {
      for (let col = 0; col < $cols; col++) {
        const i = row * $cols + col
        sprites![i]!.tint = colors[cellsView[i]!]!
      }
    }

    renderer!.render(stage!)
  }

  step = () => {
    automaton.step()
    redraw()
    $generation += 1
  }

  onMount(() => {
    automaton.randomizeCells(0.5)
    draw($rows, $cols, $cellSize)
  })

  onDestroy(() => {
    unsubNumCells()
    unsubCellSize()
    unsubRows()
    unsubCols()

    stage?.destroy(true)
    renderer?.destroy()
  })
</script>

<div class="flex justify-center">
  <Renderer
    bind:instance={renderer}
    bind:stage
    clearBeforeRender={true}
    powerPreference="high-performance"
    width={$width}
    height={$height}
    backgroundColor={colors[0]}
  >
    <div slot="view" class="border-2 border-fg" />

    <Ticker autoStart={false} maxFPS={60} instance={PIXI.Ticker.shared} on:tick={step}>
      <Container
        bind:instance={stage}
        accessibleChildren={false}
        accessiblePointerEvents="none"
        interactive={false}
        interactiveChildren={false}
      />
    </Ticker>
  </Renderer>
</div>
