<script lang="ts">
  import init, { Automaton } from 'golem'
  import { onMount } from 'svelte'

  import { automaton, cols, rows } from '$lib'
  import App from './App.svelte'
  import Options from './Options.svelte'
  import Stats from './Stats.svelte'

  let memory: WebAssembly.Memory | undefined

  onMount(() => {
    init()
      .then((res) => {
        memory = res.memory
        $automaton = new Automaton($rows, $cols)
        $automaton.randomizeCells(0.5)
      })
      .catch(console.error)
  })
</script>

<section>
  <div class="flex flex-col items-center">
    <h1 class="mx-1 mt-2 border-2 border-b-0 border-fg p-3 text-xl sm:text-2xl md:text-3xl">
      Golem
    </h1>
  </div>

  {#if $automaton === undefined || memory === undefined}
    <!-- TODO: fallback
    <div
      style:width={$width}
      style:height={$height}
      class="mx-auto inline-flex items-center justify-center border-2 border-fg"
    >
      <span>Loading..</span>
    </div> -->
  {:else}
    <App automaton={$automaton} {memory} />
  {/if}

  <div class="mx-auto max-w-screen-lg px-12">
    <Stats />
    <Options />
  </div>
</section>
