<script lang="ts">
  import * as PIXI from 'pixi.js'
  import { onMount } from 'svelte'
  import { ParticleContainer, Renderer, Ticker } from 'svelte-pixi'

  import { automaton, cellSize, colors, cols, height, rows, width } from '$stores'

  PIXI.utils.skipHello()
  PIXI.settings.RESOLUTION = window.devicePixelRatio
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  PIXI.settings.ROUND_PIXELS = true

  export let memory: WebAssembly.Memory

  const mem = new Uint8Array(memory.buffer, $automaton!.cellsPtr(), $rows * $cols)
  let container: PIXI.ParticleContainer | undefined
  let cells: PIXI.Graphics[] = []

  $: {
    cells.forEach((cell) => cell.destroy())

    if (container !== undefined) {
      cells = new Array($rows * $cols).fill(new PIXI.Graphics())

      for (let row = 0; row < $rows; row++) {
        for (let col = 0; col < $cols; col++) {
          const i = row * $cols + col
          const state = mem[i]!

          if (state > 0) {
            cells[i]!.beginFill(colors[state])
              .drawRect(col * $cellSize, row * $cellSize, $cellSize, $cellSize)
              .endFill()
          }
        }
      }
    }

    if (cells.length > 0) {
      container?.addChild(...cells)
    }
  }

  onMount(() => () => cells.forEach((cell) => cell.destroy()))
</script>

<div class="text-center leading-none">
  <Renderer autoDensity width={$width} height={$height} backgroundColor={0x212121}>
    <div slot="view" class="inline-block border-2 border-fg" />

    <Ticker instance={PIXI.Ticker.shared} autoStart={false}>
      <ParticleContainer bind:instance={container} maxSize={$rows * $cols} />
    </Ticker>
  </Renderer>
</div>
