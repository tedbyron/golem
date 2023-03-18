<script lang="ts">
  import init, { Automaton } from 'golem'
  import { onMount } from 'svelte'

  import { automaton, cells, cols, numCells, rows } from '$lib'
  import App from './App.svelte'
  import Options from './Options.svelte'
  import Stats from './Stats.svelte'

  onMount(async () => {
    try {
      const res = await init()
      $automaton = new Automaton($rows, $cols)
      $automaton.randomizeCells(0.5)
      $cells = new Uint8Array(res.memory.buffer, $automaton.cellsPtr(), $numCells)
    } catch (e) {
      console.error(e)
    }
  })
</script>

<section>
  <div class="flex flex-col items-center">
    <h1 class="mx-1 mt-2 border-2 border-b-0 border-fg p-3 text-xl sm:text-2xl md:text-3xl">
      Golem
    </h1>
  </div>

  {#if $automaton === undefined || $cells === undefined}
    <!-- TODO: loading fallback; inline style no work wtf
    <div
      style:width={$width}
      style:height={$height}
      class="mx-auto inline-flex items-center justify-center border-2 border-fg"
    >
      <span>Loading..</span>
    </div> -->
  {:else}
    <App automaton={$automaton} cells={$cells} />
  {/if}

  <div class="mx-auto max-w-screen-lg px-12">
    <Stats />
    <Options />
  </div>
</section>
