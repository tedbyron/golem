<script lang="ts">
  import * as PIXI from 'pixi.js'

  import { automaton } from '$lib'
  import { rules, updateRules, type RuleString } from '$lib/rules'

  const step = () => {
    if ($automaton === undefined) {
      return
    }

    $automaton.step()
    // draw
  }

  const clear = (): void => {
    $automaton?.setAllCells(0)
    // draw
  }

  const randomize = (): void => {
    $automaton?.randomizeCells(0.5)
    // draw
  }

  const setRules = (e: Event): void => {
    const ruleString = (e.currentTarget as HTMLSelectElement).value as RuleString
    updateRules(ruleString)
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
      on:click={step}
    >
      Step
    </button>
    <button type="button" class="golem-input-button" on:click={clear}>Clear</button>
    <button type="button" class="golem-input-button" on:click={randomize}>Randomize</button>
  </div>

  <label class="golem-options-label">
    <span class="golem-options-label-text">Rules (S/B/C)</span>
    <input type="text" class="golem-input-text" />
  </label>

  <label class="golem-options-label">
    <span class="golem-options-label-text">Preset Rules</span>
    <select class="golem-input-select" on:change={setRules}>
      {#each rules as { ruleString, name } (ruleString)}
        <option
          value={ruleString}
          selected={name === 'Life'}
          disabled={ruleString === 'none' || ruleString === ''}>{name}</option
        >
      {/each}
    </select>
  </label>
</div>
