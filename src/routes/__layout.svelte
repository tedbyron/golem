<script lang="ts" context="module">
  import '@fontsource/press-start-2p/400.css'

  import '../app.css'
</script>

<svelte:head>
  <title>Golem</title>
  <meta name="description" content="Customizable cellular automaton simulator" />
  <meta property="og:title" content="Golem" />
  <meta property="og:description" content="Customizable cellular automaton simulator" />
</svelte:head>

<main>
  <slot />
</main>
