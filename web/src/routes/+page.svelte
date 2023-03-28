<script lang="ts">
  import init, { Automaton, Rules } from 'golem'
  import { onMount } from 'svelte'

  import { automaton, cols, rows } from '$lib'
  import { rules, stringToRules } from '$lib/rules'
  import Canvas from './Canvas.svelte'
  import Controls from './Controls.svelte'
  import Stats from './Stats.svelte'

  const initialRules =
    localStorage.getItem('rules') ?? rules.find(({ name }) => name === 'Life')!.ruleString

  let memory: WebAssembly.Memory | undefined

  onMount(async () => {
    try {
      memory = (await init()).memory
      $automaton = new Automaton($rows, $cols)
      const storedRules = localStorage.getItem('rules')
      if (storedRules !== null) {
        const rules = stringToRules(storedRules)
        if (rules !== null) {
          $automaton.rules = new Rules(...rules)
        }
      }
    } catch (e) {
      console.error(e) // TODO
    }
  })
</script>

<section>
  <div class="flex flex-col items-center">
    <h1 class="mt-2 border-2 border-b-0 border-fg p-3 text-xl sm:text-2xl md:text-3xl">Golem</h1>
  </div>

  {#if $automaton === undefined || memory === undefined}
    <!-- TODO: loading fallback
    <div
      style:width={$width}
      style:height={$height}
      class="mx-auto inline-flex items-center justify-center border-2 border-fg"
    >
      <span>Loading..</span>
    </div> -->
  {:else}
    <Canvas automaton={$automaton} {memory} />
  {/if}

  <div class="mx-auto max-w-screen-lg px-12">
    <Stats />
    <Controls {initialRules} />
  </div>
</section>
