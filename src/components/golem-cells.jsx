import { PixiComponent, withPixiApp } from '@inlet/react-pixi'
import { memory } from 'golem/lib_bg.wasm'
import * as PIXI from 'pixi.js'

const behavior = {
  create: () => new PIXI.Graphics(),
  applyProps: (instance, _, props) => {
    const { cellSize, colors, rows, cols, automaton, area } = props
    const cellsPtr = automaton.getCellsPtr()

    const drawCells = () => {
      // TODO: this doesn't need to be initialized every draw, only when the automaton is resized
      const cells = new Uint8Array(memory.buffer, cellsPtr, area)

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

    // useTick(delta => {
    //   instance.clear()
    //   drawCells()
    //   automaton.step(delta)
    // })

    // TODO: move outside draw loop
    if (PIXI.Ticker.shared.count === 1) {
      PIXI.Ticker.shared.add(() => {
        instance.clear()
        drawCells()
        automaton.step()
      })
    }
  }
}

export default withPixiApp(PixiComponent('GolemCells', behavior))
