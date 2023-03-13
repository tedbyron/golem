<script lang="ts">
  import * as PIXI from 'pixi.js'
  import { ParticleContainer, Renderer, Ticker } from 'svelte-pixi'

  import { automaton, cellSize, colors, cols, height, rows, width } from '$lib'

  PIXI.utils.skipHello()
  PIXI.settings.RESOLUTION = window.devicePixelRatio
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  PIXI.settings.ROUND_PIXELS = true

  export let memory: WebAssembly.Memory

  let renderer: PIXI.Renderer | undefined
  let stage: PIXI.Container<PIXI.DisplayObject> | undefined
  let textures: PIXI.Texture[] = []
  let container: PIXI.ParticleContainer | undefined
  let cells: PIXI.Sprite[] = []

  $: numCells = $rows * $cols
  $: mem = new Uint8Array(memory.buffer, $automaton!.cellsPtr(), numCells)

  $: if (renderer !== undefined) {
    textures = colors.map((color) =>
      renderer!.generateTexture(
        new PIXI.Graphics().beginFill(color).drawRect(0, 0, $cellSize, $cellSize).endFill()
      )
    )
  }

  $: {
    if (container !== undefined) {
      cells = new Array(numCells)

      for (let row = 0; row < $rows; row++) {
        for (let col = 0; col < $cols; col++) {
          const i = row * $cols + col
          const state = mem[i]!

          if (state > 0) {
            cells[i] = new PIXI.Sprite(textures[state])
            cells[i]?.anchor.set(col * $cellSize, row * $cellSize)
          }
        }
      }
    }

    if (container !== undefined && cells.length > 0) {
      container.addChild(...cells)
    }
  }
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

    <Ticker instance={PIXI.Ticker.shared} autoStart={false}>
      <ParticleContainer bind:instance={container} interactiveChildren={false} maxSize={numCells} />
    </Ticker>
  </Renderer>
</div>
