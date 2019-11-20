export default function GolemGrid(p5) {
  const MAX_STATES = 20;
  const STATE_COLORS = [];

  let cellWidth = 5;
  let gridWidth = Math.floor((document.documentElement.clientWidth - 4) / cellWidth) * cellWidth;
  let gridHeight = 500;
  let rows = Math.floor(gridWidth / cellWidth);
  let cols = Math.floor(gridHeight / cellWidth);
  let gridIsLooping;

  let grid, nextGrid, generationCount, speed, compactRules, birthRule, survivalRule, generationRule;

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
        p5.setNextGridSame();
      }
    }

    if (props.buttonClick === 'startstop') {
      if (gridIsLooping) {
        p5.noLoop();
        gridIsLooping = false;
      } else {
        p5.loop();
        gridIsLooping = true;
      }
    } else if (props.buttonClick === 'step') {
      p5.redraw();
    } else if (props.buttonClick === 'clear') {
      p5.setNextGridZero();
    } else if (props.buttonClick === 'randomize') {
      p5.setNextGridRandom();
    }
  };

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
   */
  p5.setNextGridSame = (resetGenCount) => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        nextGrid[row][col] = grid[row][col];
      }
    }

    if (generationCount > 0) {
      generationCount--;
    }
    p5.redraw();
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

    // set colors for all possible cell states
    STATE_COLORS.push(p5.color(0), p5.color(255, 214, 0));
    for (let i = 0; i < 20; i++) {
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

    // loop through available neighbors and count neighbors if they are alive and not dying
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

    // number of neighbors needed for a dead cell to come to life
    birthRule = RULES_ARRAY[0].split('');
    for (let i = 0; i < birthRule.length; i++) {
      birthRule[i] = parseInt(birthRule[i], 10);
    }

    // number of neighbors needed for a live cell to survive, -1 if cells cannot survive
    if (RULES_ARRAY[1].match(/-1/g)) {
      survivalRule = -1;
    } else {
      survivalRule = RULES_ARRAY[1].split('');
      for (let i = 0; i < survivalRule.length; i++) {
        survivalRule[i] = parseInt(survivalRule[i], 10);
      }
    }

    // number of possible cell states
    generationRule = Math.min(MAX_STATES, parseInt(RULES_ARRAY[2], 10));
  }

  /**
   * calculate every future cell state into nextGrid
   */
  p5.gridStep = () => {
    // loop through every cell and determine its future state
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // get each cell's state and its number of neighbors
        const CURRENT_STATE = grid[row][col];
        const NEIGHBOR_COUNT = p5.getNeighborCount(row, col);

        if (!CURRENT_STATE) {
          if (birthRule.includes(NEIGHBOR_COUNT)) {
            // if the cell fulfils the birth rule
            nextGrid[row][col] = 1;
          }
        } else if (CURRENT_STATE < generationRule - 1 || generationRule === 2) {
          // if the cell fulfils the survival rule
          let shouldSurvive = survivalRule === -1 ? false : survivalRule.includes(NEIGHBOR_COUNT);

          if (!shouldSurvive) {
            // advance the state if the cell should die
            nextGrid[row][col] = (CURRENT_STATE + 1) % generationRule;
          } else if (CURRENT_STATE === 1) {
            // keep the state if the cell should survive and it's not already dying
            nextGrid[row][col] = CURRENT_STATE;
          } else {
            // advance the state if the cell is dying
            nextGrid[row][col] = CURRENT_STATE + 1;
          }
        } else if (CURRENT_STATE >= generationRule - 1) {
          // if the cell has reached its final state before death
          nextGrid[row][col] = 0;
        }
      }
    }
  }

  /**
   * initialize canvas and grids
   */
  p5.setup = () => {
    p5.createCanvas(gridWidth, gridHeight);
    p5.frameRate(speed);

    grid = new Array(rows).fill().map(() => new Array(cols));
    nextGrid = new Array(rows).fill().map(() => new Array(cols));
    gridIsLooping = false;

    p5.setNextGridRandom();
    p5.setStyle();
    p5.getRules();

    p5.noLoop();
  }

  /**
   * draw the grid in the canvas
   */
  p5.draw = () => {
    p5.background(0);
    generationCount++;

    // draw live cells on the canvas and advance the state of the grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const CURRENT_STATE = Math.min(nextGrid[row][col], generationRule - 1);
        if (CURRENT_STATE) {
          p5.fill(STATE_COLORS[CURRENT_STATE]);
          p5.rect(row * cellWidth, col * cellWidth, cellWidth, cellWidth);
        }
        grid[row][col] = CURRENT_STATE;
      }
    }

    p5.gridStep();
  }
}
