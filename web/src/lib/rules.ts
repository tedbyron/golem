import { Rules } from 'golem'

import { automaton } from '.'

export const updateRules = (rule: string): void => {
  if (rule === '') {
    return
  }

  const split = rule.split('/')
  const s = new Uint8Array(split[0]!.split('').map((n) => parseInt(n, 10)))
  const b = new Uint8Array(split[1]!.split('').map((n) => parseInt(n, 10)))
  const c = parseInt(split[2]!, 10)
  console.log(`${s.toString()}/${b.toString()}/${c}`)

  automaton.update((a) => {
    if (a !== undefined) {
      a.rules = new Rules(s, b, c)
    }

    return a
  })
}

export const rules = [
  { value: 'none', name: '(None)' },
  { value: '125/36/2', name: '2x2' },
  { value: '23/34/2', name: '34 Life' },
  { value: '35678/4678/2', name: 'Anneal' },
  { value: '2367/3457/5', name: 'Banners' },
  { value: '23/23/8', name: 'BelZhab' },
  { value: '145678/23/8', name: 'BelZhab Sediment' },
  { value: '234/34678/24', name: 'Bloomerang' },
  { value: '345/24/25', name: 'Bombers' },
  { value: '6/246/3', name: 'Brain 6' },
  { value: '/2/3', name: "Brian's Brain" },
  { value: '0235678/3468/9', name: 'Burst' },
  { value: '235678/3468/9', name: 'Burst II' },
  { value: '124567/378/4', name: 'Caterpillars' },
  { value: '2345/1234/8', name: 'Circuit Genius' },
  { value: '23/2/8', name: 'Cooties' },
  { value: '5678/35678/2', name: 'Diamoeba' },
  { value: '23/37/2', name: 'DryLife' },
  { value: '012478/36/18', name: 'Ebb & Flow' },
  { value: '012468/37/18', name: 'Ebb & Flow II' },
  { value: '2/2/25', name: 'Faders' },
  { value: '2/13/21', name: 'Fireworks' },
  { value: '347/23/8', name: 'Flaming Starbows' },
  { value: '12/34/3', name: 'Frogs' },
  { value: '356/23/6', name: 'Frozen Spirals' },
  { value: '035678/245678/7', name: 'Glisserati' },
  { value: '035678/245678/5', name: 'Glissergy' },
  { value: '23/36/2', name: 'HighLife' },
  { value: '12345/45678/8', name: 'Lava' },
  { value: '23/3/2', name: 'Life' },
  { value: '012345/458/3', name: 'Lines' },
  { value: '345/3/6', name: 'LivingOnTheEdge' },
  { value: '1234/3/2', name: 'Mazectric' },
  { value: '01245678/3/8', name: 'Meteor Guns' },
  { value: '245/3678/2', name: 'Morley' },
  { value: '45678/2478/25', name: 'Nova' },
  { value: '3/2/4', name: 'OrthoGo' },
  { value: '23/38/2', name: 'Pedestrian Life' },
  { value: '345/34/6', name: 'Prairie on Fire' },
  { value: '2/23/8', name: 'RainZha' },
  { value: '2467/2678/6', name: 'Rake' },
  { value: '/2/2', name: 'Seeds' },
  { value: '45678/25678/4', name: 'SediMental' },
  { value: '03467/25/6', name: 'Snake' },
  { value: '13458/38/6', name: 'SoftFreeze' },
  { value: '2/234/5', name: 'Spirals' },
  { value: '345/2/4', name: 'Star Wars' },
  { value: '3456/2/6', name: 'Sticks' },
  { value: '23/34/8', name: 'Swirl' },
  { value: '1234/34/48', name: 'ThrillGrill' },
  { value: '345/26/5', name: 'Transers' },
  { value: '0345/26/6', name: 'Transers II' },
  { value: '345/34678/5', name: 'Wanderers' },
  { value: '3467/25/6', name: 'Worms' },
  { value: '1456/2356/16', name: 'Xtasy' },
  { value: '', name: '' },
  { value: '4567/2567/4', name: "(Ted's) Beehive" },
  { value: '35/2/3', name: "(Ted's) Headache" },
  { value: '2356/378/4', name: "(Ted's) Mitosis" },
  { value: '2578/2578/6', name: "(Ted's) Runners" },
  { value: '0123/3/2', name: "(Ted's) SlowMaze" },
  { value: '34678/3678/3', name: "(Ted's) Starry Night" },
  { value: '345/357/4', name: "(Ted's) Sunbursts" },
  { value: '3467/2468/13', name: "(Ted's) Zoomies" }
] as const
