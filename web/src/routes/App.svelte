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

  import { cellSize, colors, cols, generation, height, numCells, rows, started, width } from '$lib'

  import type { Automaton } from 'golem'

  export let automaton: Automaton
  export let memBuf: ArrayBuffer

  $: cellsView = new Uint8Array(memBuf, automaton.cellsPtr(), $numCells)

  let renderer: PIXI.Renderer | undefined
  let stage: PIXI.Container | undefined
  let rect: PIXI.Graphics | undefined
  let graphics: PIXI.Graphics[] | undefined

  /**
   * Destroys graphics objects and creates new ones based on the current state.
   * @param rows
   * @param cols
   * @param cellSize
   */
  const draw = (rows: number, cols: number, cellSize: number) => {
    cellsView = new Uint8Array(memBuf, automaton.cellsPtr(), $numCells)

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

  redraw = () => {
    cellsView = new Uint8Array(memBuf, automaton.cellsPtr(), $numCells)

    for (let row = 0; row < $rows; row++) {
      for (let col = 0; col < $cols; col++) {
        const i = row * $cols + col
        graphics![i]!.tint = colors[cellsView[i]!]!
      }
    }

    renderer!.render(stage!)
  }

  const unsubCellSize = cellSize.subscribe((val) => {
    draw($rows, $cols, val)
  })
  const unsubRows = rows.subscribe((val) => {
    draw(val, $cols, $cellSize)
  })
  const unsubCols = cols.subscribe((val) => {
    draw($rows, val, $cellSize)
  })

  step = () => {
    automaton.step()
    redraw()
    $generation += 1
  }

  onMount(() => {
    PIXI.Ticker.shared.add(function () {
      $started = this.started
    }, PIXI.Ticker.shared)

    automaton.randomizeCells(0.5)
    draw($rows, $cols, $cellSize)
    renderer!.render(stage!)
  })
  onDestroy(() => {
    unsubCellSize()
    unsubRows()
    unsubCols()

    graphics?.forEach((cell) => cell.destroy())
    rect?.destroy()
    stage?.destroy()
    renderer?.destroy()
  })
</script>

<div class="text-center leading-none">
  <Renderer
    bind:instance={renderer}
    bind:stage
    autoDensity
    width={$width}
    height={$height}
    backgroundColor={colors[0]}
  >
    <div slot="view" class="inline-block border-2 border-fg" />

    <Ticker instance={PIXI.Ticker.shared} autoStart={false} on:tick={step}>
      <Container bind:instance={stage} interactiveChildren={false} />
    </Ticker>
  </Renderer>
</div>
