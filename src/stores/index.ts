import * as PIXI from 'pixi.js'
import { derived, get, readable, writable } from 'svelte/store'

import type { Automaton } from 'golem'

export const cellSize = writable(5)
const colors = [0x212121, 0xffd600]
for (let i = 0; i < 23; i += 1) {
  colors.push(parseInt(Math.floor(Math.random() * 0xffffff).toString(16), 16))
}
export { colors }

const maxWidth = 1200
const maxHeight = 400
const clientWidth = readable<number>(document.body.clientWidth, (set) => {
  const handleResize = (): void => set(document.body.clientWidth)
  document.body.addEventListener('resize', handleResize)
  return () => document.body.removeEventListener('resize', handleResize)
})
// const clientHeight = readable<number>(document.body.clientHeight, (set) => {
//   const handleResize = (): void => set(document.body.clientHeight)
//   document.body.addEventListener('resize', handleResize)
//   return () => document.body.removeEventListener('resize', handleResize)
// })
export const rows = derived(cellSize, ($cellSize) => Math.floor((maxHeight - 4) / $cellSize))
export const cols = derived([cellSize, clientWidth], ([$cellSize, $clientWidth]) => {
  return Math.min(maxWidth / $cellSize, Math.floor(($clientWidth - 4) / $cellSize))
})
export const width = derived([cols, cellSize], ([$cols, $cellSize]) => $cols * $cellSize)
export const height = derived([rows, cellSize], ([$rows, $cellSize]) => $rows * $cellSize)

export const automaton = writable<Automaton | undefined>(undefined)
export const run = writable(true)

rows.subscribe(($rows) => {
  const inner = get(automaton)

  if (inner !== undefined) {
    inner.rows = $rows
  }
})

cols.subscribe(($cols) => {
  const inner = get(automaton)

  if (inner !== undefined) {
    inner.cols = $cols
  }
})

run.subscribe(($run) => {
  $run ? PIXI.Ticker.shared.start() : PIXI.Ticker.shared.stop()
})
