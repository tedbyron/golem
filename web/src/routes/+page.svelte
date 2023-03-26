<script lang="ts">
  import init, { Automaton } from 'golem'
  import { onMount } from 'svelte'

  import { automaton, cols, rows } from '$lib'
  import App from './App.svelte'
  import Controls from './Controls.svelte'
  import Stats from './Stats.svelte'

  let memBuf: ArrayBuffer | undefined

  onMount(async () => {
    try {
      const { memory } = await init()
      $automaton = new Automaton($rows, $cols)
      memBuf = memory.buffer
    } catch (e) {
      console.error(e) // TODO
    }
  })
</script>

<section>
  <div class="flex flex-col items-center">
    <h1 class="mx-1 mt-2 border-2 border-b-0 border-fg p-3 text-xl sm:text-2xl md:text-3xl">
      Golem
    </h1>
  </div>

  {#if $automaton === undefined || memBuf === undefined}
    <!-- TODO: loading fallback; inline style no work wtf
    <div
      style:width={$width}
      style:height={$height}
      class="mx-auto inline-flex items-center justify-center border-2 border-fg"
    >
      <span>Loading..</span>
    </div> -->
  {:else}
    <App automaton={$automaton} {memBuf} />
  {/if}

  <div class="mx-auto max-w-screen-lg px-12">
    <Stats />
    <Controls />
  </div>
</section>
