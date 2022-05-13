<script lang="ts">
  import { onDestroy } from 'svelte'
  import init, { Automaton } from 'golem'

  let a = new Automaton(100, 100)
  let ptr = a.cellsPtr()

  onDestroy(() => {
    if (a) {
      a.free()
    }
  })
</script>

{#if a}
  <div>
    {a.rows}x{a.cols}
    {ptr}
  </div>
{/if}
