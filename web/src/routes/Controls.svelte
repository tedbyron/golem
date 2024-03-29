<script lang="ts">
  import * as PIXI from 'pixi.js'

  import { automaton, generation } from '$lib'
  import { rules, stringToRules, updateRules, type RuleString } from '$lib/rules'
  import { redraw, step } from './Canvas.svelte'

  export let initialRules: string

  let started = false
  let rulesInput = initialRules
  let invalidRulesInput = stringToRules(initialRules) === null
  let rulesSelect: RuleString = rules.some(({ ruleString }) => ruleString === initialRules)
    ? (initialRules as RuleString)
    : 'none'

  const startStop = () => {
    if (started) {
      PIXI.Ticker.shared.stop()
      started = false
    } else {
      PIXI.Ticker.shared.start()
      started = true
    }
  }

  const clear = (): void => {
    $automaton?.setAllCells(0)
    redraw()
    $generation = 0
  }

  const randomize = (): void => {
    $automaton?.randomizeCells(0.5)
    redraw()
    $generation = 0
  }

  const onRulesInput = (e: Event): void => {
    const input = (e.currentTarget as HTMLInputElement).value
    rulesInput = input
    localStorage.setItem('rules', input)

    const newRules = stringToRules(input)
    if (newRules === null) {
      invalidRulesInput = true
    } else {
      invalidRulesInput = false
      updateRules(newRules)

      const found = rules.find(({ ruleString }) => ruleString === $automaton?.rules.toString())
      if (found === undefined) {
        rulesSelect = 'none'
      } else {
        rulesSelect = found.ruleString
      }
    }
  }

  const onRulesSelect = (e: Event): void => {
    const ruleString = (e.currentTarget as HTMLSelectElement).value as RuleString
    rulesInput = ruleString
    localStorage.setItem('rules', ruleString)
    invalidRulesInput = false

    const newRules = stringToRules(ruleString)
    updateRules(newRules!)
  }
</script>

<div class="controls">
  <div class="controls-buttons">
    <button type="button" class="input-button" on:click={startStop}>
      {started ? 'Stop' : 'Start'}
    </button>
    <button
      type="button"
      class="input-button"
      disabled={started}
      on:click={() => {
        step()
      }}
    >
      Step
    </button>
    <button type="button" class="input-button" on:click={clear}>Clear</button>
    <button type="button" class="input-button" on:click={randomize}>Randomize</button>
  </div>

  <label class="controls-label">
    <span class="controls-label-text" class:text-invalid={invalidRulesInput}>Rules (S/B/C)</span>
    <input type="text" bind:value={rulesInput} on:input={onRulesInput} class="input-text" />
  </label>

  <label class="controls-label">
    <span class="controls-label-text">Preset Rules</span>
    <select class="input-select" bind:value={rulesSelect} on:change={onRulesSelect}>
      {#each rules as { ruleString, name } (ruleString)}
        <option
          value={ruleString}
          selected={ruleString === rulesSelect}
          disabled={ruleString === 'none' || ruleString === ''}>{name}</option
        >
      {/each}
    </select>
  </label>
</div>
