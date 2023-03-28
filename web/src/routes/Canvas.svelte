<script lang="ts" context="module">
  import * as PIXI from 'pixi.js'

  PIXI.utils.skipHello()
  PIXI.settings.RESOLUTION = window.devicePixelRatio
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  PIXI.settings.ROUND_PIXELS = true

  /** Calculates automaton cell colors and renders. */
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
  let rect: PIXI.Graphics | undefined
  let graphics: PIXI.Graphics[] | undefined

  const unsubNumCells = numCells.subscribe((val) => {
    cellsView = new Uint8Array(memory.buffer, automaton.cellsPtr(), val)
  })

  /**
   * Destroys graphics objects and creates new ones based on the current state.
   * @param rows
   * @param cols
   * @param cellSize
   */
  const draw = (rows: number, cols: number, cellSize: number) => {
    cellsView = new Uint8Array(memory.buffer, automaton.cellsPtr(), $numCells)

    if (stage !== undefined) {
      stage.removeChildren()
      rect?.destroy()
      graphics?.forEach((c) => {
        c.destroy()
      })

      graphics = new Array($numCells)
      rect = new PIXI.Graphics().beginFill(0xffffff).drawRect(0, 0, cellSize, cellSize).endFill()

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col

          graphics[i] = rect.clone()
          graphics[i]!.position.set(col * cellSize, row * cellSize)
          graphics[i]!.tint = colors[cellsView[i]!]!
        }
      }

      stage.addChild(...graphics)
    }
  }

  const unsubCellSize = cellSize.subscribe((val) => {
    if (!(renderer === undefined || stage === undefined)) {
      draw($rows, $cols, val)
      renderer.render(stage!)
    }
  })
  const unsubRows = rows.subscribe((val) => {
    if (!(renderer === undefined || stage === undefined)) {
      draw(val, $cols, $cellSize)
      renderer.render(stage!)
    }
  })
  const unsubCols = cols.subscribe((val) => {
    if (!(renderer === undefined || stage === undefined)) {
      draw($rows, val, $cellSize)
      renderer.render(stage!)
    }
  })

  redraw = () => {
    cellsView = new Uint8Array(memory.buffer, automaton.cellsPtr(), $numCells)

    for (let row = 0; row < $rows; row++) {
      for (let col = 0; col < $cols; col++) {
        const i = row * $cols + col
        graphics![i]!.tint = colors[cellsView[i]!]!
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
    renderer!.render(stage!)
  })

  onDestroy(() => {
    unsubNumCells()
    unsubCellSize()
    unsubRows()
    unsubCols()

    graphics?.forEach((cell) => cell.destroy())
    rect?.destroy()
    stage?.destroy()
    renderer?.destroy()
  })
</script>

<div class="flex justify-center">
  <Renderer
    bind:instance={renderer}
    bind:stage
    autoDensity
    width={$width}
    height={$height}
    backgroundColor={colors[0]}
  >
    <div slot="view" class="border-2 border-fg" />

    <Ticker instance={PIXI.Ticker.shared} autoStart={false} on:tick={step}>
      <Container bind:instance={stage} interactiveChildren={false} />
    </Ticker>
  </Renderer>
</div>
