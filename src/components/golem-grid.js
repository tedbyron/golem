export default function GolemGrid(p5) {
  const MAX_STATES = 20;
  const STATE_COLORS = [];

  let gridWidth = 737;
  let gridHeight = 500;
  let cellWidth = 5;
  let rows = Math.floor(gridWidth / cellWidth);
  let cols = Math.floor(gridHeight / cellWidth);

  let grid = [];
  let nextGrid = [];

  let speed = 24;
  let rules = '3, 23, 2'; // conway's game of life
  // let rules = '2, -1, 3'; // brian's brain
  // let rules = '3678, 34678, 3'; // starry night
  // let rules = '246, 346, 6'; // lucy in the sky
  let birthRule, survivalRule, generationRule;

  p5.setGridRandom = () => {
    for (let row = 0; row < rows; row++) {
      grid[row] = [];
      nextGrid[row] = [];
      for (let col = 0; col < cols; col++) {
        grid[row][col] = 0;
        nextGrid[row][col] = Math.floor(Math.random() * 2);
      }
    }
  }

  p5.setStyle = () => {
    p5.stroke('black');
    p5.strokeWeight(0);

    // set colors for possible cell states
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

  p5.getRules = () => {
    const RULES_ARRAY = rules.match(/-?[0-9]+/g);

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

  p5.setup = () => {
    p5.createCanvas(gridWidth, gridHeight);
    p5.frameRate(speed);

    p5.getRules();
    p5.setGridRandom();
    p5.setStyle();

    p5.noLoop();
  }

  p5.draw = () => {
    p5.background(0);

    // draw live cells on the canvas and advance the state of the grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const CURRENT_STATE = nextGrid[row][col];
        if (CURRENT_STATE) {
          p5.fill(STATE_COLORS[CURRENT_STATE]);
          p5.rect(row * cellWidth, col * cellWidth, cellWidth, cellWidth);
        }
        grid[row][col] = CURRENT_STATE;
      }
    }

    p5.gridStep();
    p5.loop();
  }
}
