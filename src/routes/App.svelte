<script lang="ts">
  import * as PIXI from 'pixi.js'
  import { onDestroy, onMount } from 'svelte'
  import { Container, Renderer, Ticker } from 'svelte-pixi'

  import { cellSize, colors, cols, height, rows, width } from '$lib'

  import type { Automaton } from 'golem'

  export let automaton: Automaton
  export let memory: WebAssembly.Memory

  PIXI.utils.skipHello()
  PIXI.settings.RESOLUTION = window.devicePixelRatio
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  PIXI.settings.ROUND_PIXELS = true

  let renderer: PIXI.Renderer | undefined
  let stage: PIXI.Container | undefined
  let rect: PIXI.Graphics | undefined
  let cells: PIXI.Graphics[] | undefined

  $: numCells = $rows * $cols
  $: mem = new Uint8Array(memory.buffer, automaton.cellsPtr(), numCells)

  const draw = (rows: number, cols: number, cellSize: number) => {
    if (stage !== undefined) {
      stage.removeChildren()
      rect?.destroy()
      cells?.forEach((c) => {
        c.destroy()
      })

      cells = new Array(numCells)
      rect = new PIXI.Graphics().beginFill(0xffffff).drawRect(0, 0, cellSize, cellSize).endFill()

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col

          cells[i] = rect.clone()
          cells[i]!.position.set(col * cellSize, row * cellSize)
          cells[i]!.tint = colors[mem[i]!]!
        }
      }

      stage.addChild(...cells)
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

  const onTick = ({ detail: _delta }: CustomEvent<number>) => {
    automaton.step()

    for (let row = 0; row < $rows; row++) {
      for (let col = 0; col < $cols; col++) {
        const i = row * $cols + col
        cells![i]!.tint = colors[mem[i]!]!
      }
    }

    renderer!.render(stage!)
  }

  onMount(() => {
    draw($rows, $cols, $cellSize)
    renderer!.render(stage!)
  })
  onDestroy(() => {
    unsubCellSize()
    unsubRows()
    unsubCols()

    cells?.forEach((cell) => cell.destroy())
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
    backgroundColor={0x212121}
  >
    <div slot="view" class="inline-block border-2 border-fg" />

    <Ticker instance={PIXI.Ticker.shared} autoStart={false} on:tick={onTick}>
      <Container bind:instance={stage} interactiveChildren={false} />
    </Ticker>
  </Renderer>
</div>
