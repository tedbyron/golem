<script lang="ts">
  import * as PIXI from 'pixi.js'

  import { rules, updateRules } from '$lib/rules'

  type Rule = (typeof rules)[number]['value']
  let selected: Rule

  const selectRule = (e: Event) => {
    const t = e.currentTarget as HTMLSelectElement
    updateRules(t.value)
    selected = t.value as Rule
  }
</script>

<div class="golem-options">
  <div class="golem-options-buttons">
    <button
      type="button"
      class="golem-input-button"
      on:click={() => {
        PIXI.Ticker.shared.started ? PIXI.Ticker.shared.stop() : PIXI.Ticker.shared.start()
      }}
    >
      {PIXI.Ticker.shared.started ? 'Stop' : 'Start'}
    </button>
    <button
      type="button"
      class="golem-input-button"
      disabled={!PIXI.Ticker.shared.started}
      on:click={() => {}}
    >
      Step
    </button>
    <button type="button" class="golem-input-button">Clear</button>
    <button type="button" class="golem-input-button">Randomize</button>
  </div>

  <label class="golem-options-label">
    <span class="golem-options-label-text">Rules (S/B/C)</span>
    <input type="text" class="golem-input-text" />
  </label>

  <label class="golem-options-label">
    <span class="golem-options-label-text">Preset Rules</span>
    <select class="golem-input-select" bind:value={selected} on:change={selectRule}>
      {#each rules as { value, name } (name)}
        <option {value} disabled={value === 'none' || value === ''} selected={value === selected}
          >{name}</option
        >
      {/each}
    </select>
  </label>
</div>
