import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

import { memory } from '../../rs/pkg/golem_bg.wasm';

const behavior = {
  customDisplayObject: () => new PIXI.Graphics(),
  customApplyProps: (instance, _, newProps) => {
    const {
      rows, cols, cellsPtr, cellSize, colors,
    } = newProps;
    const cells = new Uint8Array(memory.buffer, cellsPtr, rows * cols);

    instance.clear();
    instance.beginFill(colors[0]);

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        if (cells[row * cols + col] > 0) {
          instance.drawRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    }

    instance.endFill();
  },
};
const type = 'GolemCells';

export default CustomPIXIComponent(behavior, type);
