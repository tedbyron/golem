import { Rules } from 'golem'
import { get } from 'svelte/store'

import { automaton } from '.'

export type RuleString = (typeof rules)[number]['ruleString']

/**
 * Converts a string to rules.
 * @param input
 * @returns an array of rules, or `null` if `input` is not a valid rulestring
 */
export const stringToRules = (input: string): ConstructorParameters<typeof Rules> | null => {
  const trimmed = input.trim()
  const match = trimmed.match(/^(\d*)\/(\d+)\/(\d+)$/)
  if (match === null) {
    return null
  }

  const [, survival, birth, generation] = match

  const c = Math.min(Math.max(parseInt(generation!, 10), 2), 24) // currently max 24 generations
  if (generation !== c.toString()) {
    return null
  }

  const s = Uint8Array.from(new Set(survival!.split('').map((n) => parseInt(n, 10))))
  const b = Uint8Array.from(new Set(birth!.split('').map((n) => parseInt(n, 10))))

  return [s, b, c]
}

/**
 * Updates the automaton's rules.
 * @param rules
 */
export const updateRules = (rules: ConstructorParameters<typeof Rules>): void => {
  const a = get(automaton)
  if (a !== undefined) {
    a.rules = new Rules(...rules)
  }
}

export const rules = [
  { ruleString: 'none', name: '(None)' },
  { ruleString: '125/36/2', name: '2x2' },
  { ruleString: '23/34/2', name: '34 Life' },
  { ruleString: '35678/4678/2', name: 'Anneal' },
  { ruleString: '2367/3457/5', name: 'Banners' },
  { ruleString: '23/23/8', name: 'BelZhab' },
  { ruleString: '145678/23/8', name: 'BelZhab Sediment' },
  { ruleString: '234/34678/24', name: 'Bloomerang' },
  { ruleString: '345/24/25', name: 'Bombers' },
  { ruleString: '6/246/3', name: 'Brain 6' },
  { ruleString: '/2/3', name: "Brian's Brain" },
  { ruleString: '0235678/3468/9', name: 'Burst' },
  { ruleString: '235678/3468/9', name: 'Burst II' },
  { ruleString: '124567/378/4', name: 'Caterpillars' },
  { ruleString: '2345/1234/8', name: 'Circuit Genius' },
  { ruleString: '23/2/8', name: 'Cooties' },
  { ruleString: '5678/35678/2', name: 'Diamoeba' },
  { ruleString: '23/37/2', name: 'DryLife' },
  { ruleString: '012478/36/18', name: 'Ebb & Flow' },
  { ruleString: '012468/37/18', name: 'Ebb & Flow II' },
  { ruleString: '2/2/25', name: 'Faders' },
  { ruleString: '2/13/21', name: 'Fireworks' },
  { ruleString: '347/23/8', name: 'Flaming Starbows' },
  { ruleString: '12/34/3', name: 'Frogs' },
  { ruleString: '356/23/6', name: 'Frozen Spirals' },
  { ruleString: '035678/245678/7', name: 'Glisserati' },
  { ruleString: '035678/245678/5', name: 'Glissergy' },
  { ruleString: '23/36/2', name: 'HighLife' },
  { ruleString: '12345/45678/8', name: 'Lava' },
  { ruleString: '23/3/2', name: 'Life' },
  { ruleString: '012345/458/3', name: 'Lines' },
  { ruleString: '345/3/6', name: 'LivingOnTheEdge' },
  { ruleString: '1234/3/2', name: 'Mazectric' },
  { ruleString: '01245678/3/8', name: 'Meteor Guns' },
  { ruleString: '245/3678/2', name: 'Morley' },
  { ruleString: '45678/2478/25', name: 'Nova' },
  { ruleString: '3/2/4', name: 'OrthoGo' },
  { ruleString: '23/38/2', name: 'Pedestrian Life' },
  { ruleString: '345/34/6', name: 'Prairie on Fire' },
  { ruleString: '2/23/8', name: 'RainZha' },
  { ruleString: '2467/2678/6', name: 'Rake' },
  { ruleString: '/2/2', name: 'Seeds' },
  { ruleString: '45678/25678/4', name: 'SediMental' },
  { ruleString: '03467/25/6', name: 'Snake' },
  { ruleString: '13458/38/6', name: 'SoftFreeze' },
  { ruleString: '2/234/5', name: 'Spirals' },
  { ruleString: '345/2/4', name: 'Star Wars' },
  { ruleString: '3456/2/6', name: 'Sticks' },
  { ruleString: '23/34/8', name: 'Swirl' },
  { ruleString: '1234/34/48', name: 'ThrillGrill' },
  { ruleString: '345/26/5', name: 'Transers' },
  { ruleString: '0345/26/6', name: 'Transers II' },
  { ruleString: '345/34678/5', name: 'Wanderers' },
  { ruleString: '3467/25/6', name: 'Worms' },
  { ruleString: '1456/2356/16', name: 'Xtasy' },
  { ruleString: '', name: '' },
  { ruleString: '4567/2567/4', name: "(Ted's) Beehive" },
  { ruleString: '35/2/3', name: "(Ted's) Headache" },
  { ruleString: '2356/378/4', name: "(Ted's) Mitosis" },
  { ruleString: '2578/2578/6', name: "(Ted's) Runners" },
  { ruleString: '0123/3/2', name: "(Ted's) SlowMaze" },
  { ruleString: '34678/3678/3', name: "(Ted's) Starry Night" },
  { ruleString: '345/357/4', name: "(Ted's) Sunbursts" },
  { ruleString: '3467/2468/13', name: "(Ted's) Zoomies" }
] as const
