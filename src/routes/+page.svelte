<script lang="ts">
  import init, { Automaton } from 'golem'
  import { onMount } from 'svelte'

  import App from './App.svelte'
  import Options from './Options.svelte'
  import Stats from './Stats.svelte'

  import { automaton, cols, rows } from '$lib'

  let memory: WebAssembly.Memory | undefined

  onMount(async () => {
    const res = await init()
    memory = res.memory
    $automaton = new Automaton($rows, $cols)
    $automaton.randomizeCells(0.5)
  })
</script>

<section>
  <div class="flex flex-col items-center">
    <h1 class="mx-1 mt-2 border-2 border-b-0 border-fg p-3 text-xl sm:text-2xl md:text-3xl">
      Golem
    </h1>
  </div>

  {#if memory !== undefined}
    <App {memory} />
  {/if}

  <div class="mx-auto max-w-screen-lg px-12">
    <Stats />
    <Options />
  </div>
</section>
