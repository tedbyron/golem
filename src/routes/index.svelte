<script lang="ts">
  import { Automaton } from 'golem'
  import { onMount } from 'svelte'

  import Canvas from '$components/Canvas.svelte'
  import Options from '$components/Options.svelte'
  import Stats from '$components/Stats.svelte'
  import { automaton, rows, cols } from '$stores'

  onMount(() => {
    $automaton = new Automaton($rows, $cols)
  })
</script>

<section>
  <div class="golem-heading-wrapper">
    <h1 class="golem-heading">Golem</h1>
  </div>

  <Canvas />

  <div class="golem-control">
    <Stats />
    <Options />
  </div>
</section>
