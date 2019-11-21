export default function GolemGrid(p5) {
  const MAX_CANVAS_WIDTH = 1200;
  const MAX_CANVAS_HEIGHT = 400;
  const MAX_STATES = 25;
  const STATE_COLORS = [];

  let cellWidth, canvasWidth, canvasHeight, rows, cols;
  let grid, nextGrid;
  let compactRules, birthRule, survivalRule, generationRule;
  let generationCount, speed, gridIsLooping;

  /**
   * initialize canvas and grids
   */
  p5.setup = () => {
    p5.setCanvasSize();
    window.addEventListener('resize', p5.onWindowResize);
    p5.createCanvas(canvasWidth, canvasHeight);
    p5.frameRate(speed);

    p5.setNextGridRandom();
    p5.setStyle();
    p5.getRules();

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
        const CURRENT_STATE = Math.min(nextGrid[row][col], generationRule - 1);
        if (CURRENT_STATE) {
          p5.fill(STATE_COLORS[CURRENT_STATE]);
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
    speed = props.speed;

    if (compactRules !== props.compactRules) {
      compactRules = props.compactRules;
      p5.getRules();

      if (grid instanceof Array) {
        p5.setNextGridSame(true);
      }
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

    CONST TEMP_GRID = grid.slice();

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
        nextGrid[row][col] = grid[row][col];
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
   * set STATE_COLORS; generations after 1 have random colors
   */
  p5.setStyle = () => {
    p5.stroke('black');
    p5.strokeWeight(0);

    STATE_COLORS.push(p5.color(0), p5.color(255, 214, 0));
    for (let i = 0; i < MAX_STATES - 2; i++) {
      STATE_COLORS.push(
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

  /**
   * separate the compactRules for later use
   */
  p5.getRules = () => {
    const RULES_ARRAY = compactRules.match(/-?[0-9]+/g);

    birthRule = RULES_ARRAY[0].split('');
    for (let i = 0; i < birthRule.length; i++) {
      birthRule[i] = parseInt(birthRule[i], 10);
    }

    if (RULES_ARRAY[1].match(/-1/g)) {
      survivalRule = -1;
    } else {
      survivalRule = RULES_ARRAY[1].split('');
      for (let i = 0; i < survivalRule.length; i++) {
        survivalRule[i] = parseInt(survivalRule[i], 10);
      }
    }

    generationRule = Math.min(MAX_STATES, parseInt(RULES_ARRAY[2], 10));
  }
}
