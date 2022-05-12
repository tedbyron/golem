<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = ({ status, error }) => {
    return {
      props: {
        error: `${status}: ${error?.message}`
      }
    }
  }
</script>

<script lang="ts">
  export let error: string
</script>

<section class="container flex flex-col gap-6 mt-12 mb-6 text-center">
  <span class="text-5xl lg:text-6xl">&#x1fae4;</span>
  <h1 class="text-3xl lg:text-4xl">{error}</h1>
</section>
