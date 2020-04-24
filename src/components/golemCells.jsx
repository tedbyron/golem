import { CustomPIXIComponent, withApp } from 'react-pixi-fiber';

import { memory } from 'golem/golem_bg.wasm';

const behavior = {
  customDisplayObject: (props) => props.displayObj,
  customApplyProps: (instance, _, props) => {
    const {
      app, cellSize, stepSize, colors, rows, cols, automaton,
    } = props;

    app.ticker.add(() => {
      const cells = new Uint8Array(memory.buffer, automaton.cells(), rows * cols);

      instance.clear();

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          instance.beginFill(colors[cells[row * cols + col]]);
          instance.drawRect(
            col * cellSize,
            row * cellSize,
            cellSize,
            cellSize,
          );
          instance.endFill();
        }
      }

      automaton.step(stepSize);
    });
  },
};
const type = 'GolemCells';

export default withApp(CustomPIXIComponent(behavior, type));
