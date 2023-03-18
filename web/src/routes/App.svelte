<script lang="ts">
  import * as PIXI from 'pixi.js'
  import { onDestroy, onMount } from 'svelte'
  import { Container, Renderer, Ticker } from 'svelte-pixi'

  import { cellSize, colors, cols, height, numCells, rows, width } from '$lib'

  import type { Automaton } from 'golem'

  export let automaton: Automaton
  export let cells: Uint8Array

  PIXI.utils.skipHello()
  PIXI.settings.RESOLUTION = window.devicePixelRatio
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  PIXI.settings.ROUND_PIXELS = true

  let renderer: PIXI.Renderer | undefined
  let stage: PIXI.Container | undefined
  let rect: PIXI.Graphics | undefined
  let graphics: PIXI.Graphics[] | undefined

  const draw = (rows: number, cols: number, cellSize: number) => {
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
          graphics[i]!.tint = colors[cells[i]!]!
        }
      }

      stage.addChild(...graphics)
    }
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

  const step = () => {
    automaton.step()

    for (let row = 0; row < $rows; row++) {
      for (let col = 0; col < $cols; col++) {
        const i = row * $cols + col
        graphics![i]!.tint = colors[cells[i]!]!
      }
    }

    renderer!.render(stage!)
  }

  const onTick = ({ detail: _delta }: CustomEvent<number>) => {
    step()
  }

  onMount(() => {
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

    <Ticker instance={PIXI.Ticker.shared} autoStart={false} on:tick={onTick}>
      <Container bind:instance={stage} interactiveChildren={false} />
    </Ticker>
  </Renderer>
</div>
