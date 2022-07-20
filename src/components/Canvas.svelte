<script lang="ts">
  import * as PIXI from 'pixi.js'
  import { Application } from 'svelte-pixi'

  import Cells from '$components/Cells.svelte'
  import { height, width } from '$stores'

  PIXI.settings.RESOLUTION = window.devicePixelRatio
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  PIXI.settings.ROUND_PIXELS = true
</script>

<Application
  clearBeforeRender={false}
  sharedTicker
  bind:width={$width}
  bind:height={$height}
  backgroundColor={0x212121}
>
  <div class="golem-stage">
    <Cells />
  </div>
</Application>
