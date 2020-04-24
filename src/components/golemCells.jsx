import { CustomPIXIComponent, withApp } from 'react-pixi-fiber';

import { memory } from 'golem/golem_bg.wasm';

const behavior = {
  customDisplayObject: (props) => props.displayObj,
  customApplyProps: (instance, _, props) => {
    const {
      app, cellSize, stepSize, isPaused, colors, rows, cols, automaton,
    } = props;

    const drawCells = () => {
      const cells = new Uint8Array(memory.buffer, automaton.cells(), rows * cols);

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const state = cells[row * cols + col];
          if (state > 0) {
            instance.beginFill(colors[state]);
            instance.drawRect(
              col * cellSize,
              row * cellSize,
              cellSize,
              cellSize,
            );
            instance.endFill();
          }
        }
      }
    };

    if (app.ticker.count === 1) {
      app.ticker.add(() => {
        instance.clear();
        drawCells();
        automaton.step(stepSize);
      });
    }

    if (isPaused) {
      app.ticker.stop();
    } else {
      app.ticker.start();
    }
  },
};
const type = 'GolemCells';

export default withApp(CustomPIXIComponent(behavior, type));
