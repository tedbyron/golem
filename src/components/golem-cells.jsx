import { PixiComponent, withPixiApp } from '@inlet/react-pixi'
import { memory } from 'lib/ca_bg.wasm'
import * as PIXI from 'pixi.js'

const behavior = {
  create: () => new PIXI.Graphics(),
  applyProps: (instance, _, props) => {
    const { cellSize, colors, rows, cols, cellsPtr, area } = props
    // TODO: this doesn't need to be initialized every draw, only when the automaton is resized
    const cells = new Uint8Array(memory.buffer, cellsPtr, area)

    // TODO: should be able to flatten this loop
    // we can calculate the row and col based on index, total rows, and total cols
    // TODO: create a mask from PIXI.Graphics shape and create a sprite from the mask
    // don't have to create a rectangle for every cell; instead, copy the sprite and change position
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const state = cells[row * cols + col]
        if (state > 0) {
          instance.beginFill(colors[state])
          instance.drawRect(
            col * cellSize,
            row * cellSize,
            cellSize,
            cellSize
          )
          instance.endFill()
        }
      }
    }
  }
}

export default withPixiApp(PixiComponent('GolemCells', behavior))
