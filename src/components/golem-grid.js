export default function GolemGrid(p5) {
  const MAX_CANVAS_WIDTH = 1200;
  const MAX_CANVAS_HEIGHT = 400;
  const MAX_GENS = 25;
  const GEN_COLORS = [];

  let cellWidth, canvasWidth, canvasHeight, rows, cols;
  let grid, nextGrid;
  let birthRule, survivalRule, generationRule;
  let speed, gridIsLooping, generationCount;

  /**
   * initialize canvas and grids
   */
  p5.setup = () => {
    p5.setCanvasSize();
    window.addEventListener('resize', p5.onWindowResize);
    p5.createCanvas(canvasWidth, canvasHeight);
    p5.frameRate(speed);

    p5.setStyle();
    p5.setNextGridRandom();

    p5.noSmooth();
    p5.noLoop();
  }

  /**
   * draw the grid in the canvas
   */
  p5.draw = () => {
    p5.background('#212121');
    generationCount++;

    let row = 0;
    while (row < rows) {
      let col = 0;
      while (col < cols) {
        const CURRENT_STATE = nextGrid[row][col];
        if (CURRENT_STATE) {
          p5.fill(GEN_COLORS[CURRENT_STATE]);
          p5.rect(row * cellWidth, col * cellWidth, cellWidth, cellWidth);
        }
        grid[row][col] = CURRENT_STATE;
        col++;
      }
      row++;
    }

    p5.gridStep();
  }

  /**
   * react-p5-wrapper function for inheriting props
   * @param props [object] inherited react props
   */
  p5.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (birthRule !== props.rules[0]
    || survivalRule !== props.rules[1]
    || generationRule !== props.rules[2]) {
      birthRule = props.rules[0];
      survivalRule = props.rules[1];
      generationRule = Math.min(props.rules[2], MAX_GENS);

      if (grid instanceof Array) {
        p5.setNextGridSame(true);
      }
    }

    if (speed !== props.speed) {
      speed = props.speed;
      p5.frameRate(speed);
    }

    if (gridIsLooping !== props.gridIsLooping) {
      gridIsLooping = props.gridIsLooping;
      gridIsLooping ? p5.loop() : p5.noLoop();
    }

    if (props.buttonClick === 'step') {
      p5.redraw();
    } else if (props.buttonClick === 'clear') {
      p5.setNextGridZero();
    } else if (props.buttonClick === 'randomize') {
      p5.setNextGridRandom();
    }
  };

  /**
   * calculate every future cell state into nextGrid
   */
  p5.gridStep = () => {
    let row = 0;

    while (row < rows) {
      let col = 0;

      while (col < cols) {
        const CURRENT_STATE = grid[row][col];
        const NEIGHBOR_COUNT = p5.getNeighborCount(row, col);

        if (!CURRENT_STATE) {
          if (birthRule.includes(NEIGHBOR_COUNT)) {
            nextGrid[row][col] = 1;
          }
        } else if (CURRENT_STATE < generationRule - 1 || generationRule === 2) {
          const SHOULD_SURVIVE = survivalRule === -1
            ? false
            : survivalRule.includes(NEIGHBOR_COUNT);

          if (!SHOULD_SURVIVE) {
            nextGrid[row][col] = (CURRENT_STATE + 1) % generationRule;
          } else if (CURRENT_STATE === 1) {
            nextGrid[row][col] = CURRENT_STATE;
          } else {
            nextGrid[row][col] = CURRENT_STATE + 1;
          }
        } else {
          nextGrid[row][col] = 0;
        }

        col++;
      }

      row++;
    }
  }

  /**
   * set the canvas and grid sizes; copy possible cell states to the resized
   * grid
   */
  p5.onWindowResize = () => {
    cellWidth = 5;
    canvasWidth = Math.min(MAX_CANVAS_WIDTH, Math.floor((document.body.clientWidth - 4) / cellWidth) * cellWidth);
    canvasHeight = Math.floor(MAX_CANVAS_HEIGHT / cellWidth) * cellWidth;

    rows = Math.floor(canvasWidth / cellWidth);
    cols = Math.floor(canvasHeight / cellWidth);

    const TEMP_GRID = grid;

    grid = new Array(rows).fill().map(() => new Array(cols));
    nextGrid = new Array(rows).fill().map(() => new Array(cols));

    for (let row = 0; row < Math.min(TEMP_GRID.length, grid.length); row++) {
      for (let col = 0; col < Math.min(TEMP_GRID[0].length, grid[0].length); col++) {
        grid[row][col] = TEMP_GRID[row][col];
      }
    }

    p5.setNextGridSame(false);
    p5.resizeCanvas(canvasWidth, canvasHeight);
  }

  /**
   * set the canvas and grid sizes
   */
  p5.setCanvasSize = () => {
    cellWidth = 5;
    canvasWidth = Math.min(MAX_CANVAS_WIDTH, Math.floor((document.body.clientWidth - 4) / cellWidth) * cellWidth);
    canvasHeight = Math.floor(MAX_CANVAS_HEIGHT / cellWidth) * cellWidth;

    rows = Math.floor(canvasWidth / cellWidth);
    cols = Math.floor(canvasHeight / cellWidth);

    grid = new Array(rows).fill().map(() => new Array(cols));
    nextGrid = new Array(rows).fill().map(() => new Array(cols));
  }

  /**
   * set the next grid to contain random generation 1 cells or dead cells
   */
  p5.setNextGridRandom = () => {
    generationCount = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        nextGrid[row][col] = Math.floor(Math.random() * 2);
      }
    }

    p5.redraw();
  }

  /**
   * set the next grid to be the same as the current to avoid a step using the
   * previous ruleset; for use when there is a change in rules
   * @param redraw [boolean] whether the canvas should be redrawn
   */
  p5.setNextGridSame = (redraw) => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const CURRENT_STATE = grid[row][col];
        nextGrid[row][col] = CURRENT_STATE < generationRule
          ? CURRENT_STATE
          : 0;
      }
    }

    if (generationCount > 0) {
      generationCount--;
    }

    if (redraw) {
      p5.redraw();
    }
  }

  /**
   * set the next grid to contain only dead cells
   */
  p5.setNextGridZero = () => {
    generationCount = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        nextGrid[row][col] = 0;
      }
    }

    p5.redraw();
  }

  /**
   * set GEN_COLORS; generations after 1 have random colors
   */
  p5.setStyle = () => {
    p5.stroke('#212121')
    p5.strokeWeight(0);

    GEN_COLORS.push(p5.color('#212121'), p5.color(255, 214, 0));
    for (let i = 0; i < MAX_GENS - 2; i++) {
      GEN_COLORS.push(
        p5.color(
          Math.floor(Math.random() * 251),
          Math.floor(Math.random() * 251),
          Math.floor(Math.random() * 251)
        )
      );
    }
  }

  /**
   * calculate the number of neighbors a cell has
   * @param row [number] row number of the cell
   * @param col [number] column number of the cell
   */
  p5.getNeighborCount = (row, col) => {
    const NEIGHBORS = [
      [-1, -1], [-1,  0], [-1,  1],
      [ 0, -1],           [ 0,  1],
      [ 1, -1], [ 1,  0], [ 1,  1]
    ];

    let count = 0;

    for (const [i, j] of NEIGHBORS) {
      if (row + i >= 0
      && row + i < rows
      && col + j >= 0
      && col + j < cols
      && grid[row + i][col + j] === 1) {
        count++;
      }
    }

    return count;
  }
}
