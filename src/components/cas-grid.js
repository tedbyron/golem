export default function casGrid(p5) {
  const MAX_STATES = 20;
  const STATE_COLORS = [];

  let gridWidth = 800;
  let gridHeight = 600;
  let cellWidth = 5;
  let rows = Math.ceil(gridWidth / cellWidth);
  let cols = Math.ceil(gridHeight / cellWidth);

  let grid = [];
  let nextGrid = [];

  let speed = 24;
  let rules = '246, 6, 3';
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

    STATE_COLORS.push(p5.color(255), p5.color(255, 214, 0));
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
      [-1, -1], [-1, 0], [-1, 1],
      [ 0, -1],          [ 0, 1],
      [ 1, -1], [ 1, 0], [ 1, 1]
    ];
    let count = 0;

    for (const [i, j] of NEIGHBORS) {
      if (row + i >= 0
      && row + i < rows
      && col + j >= 0
      && col + j < cols
      && grid[row + i][col + j]) {
        count++;
      }
    }

    return count;
  }

  p5.getRules = () => {
    const RULES_ARRAY = rules.match(/-?[0-9]+/g);

    birthRule = RULES_ARRAY[0].split('');
    for (let i = 0; i < birthRule.length; i++) {
      birthRule[i] = parseInt(birthRule[i], 10);
    }

    survivalRule = RULES_ARRAY[1].split('');
    for (let i = 0; i < survivalRule.length; i++) {
      survivalRule[i] = parseInt(survivalRule[i], 10);
    }

    generationRule = Math.min(MAX_STATES, parseInt(RULES_ARRAY[2], 10));
  }

  p5.gridStep = () => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const CURRENT_STATE = grid[row][col];
        const NEIGHBOR_COUNT = p5.getNeighborCount(row, col);

        if (!CURRENT_STATE) {
          if (birthRule.includes(NEIGHBOR_COUNT)) {
            nextGrid[row][col] = 1;
          }
        } else if (CURRENT_STATE && (CURRENT_STATE < generationRule - 1 || generationRule === 2)) {
          let shouldSurvive = survivalRule.includes(-1) ? false : survivalRule.includes(NEIGHBOR_COUNT);

          if (!shouldSurvive) {
            nextGrid[row][col] = (CURRENT_STATE + 1) % generationRule;
          } else if (CURRENT_STATE === 1) {
            nextGrid[row][col] = CURRENT_STATE;
          }

          if (CURRENT_STATE > 1) {
            nextGrid[row][col] = CURRENT_STATE + 1;
          }
        } else if (CURRENT_STATE >= generationRule - 1) {
          nextGrid[row][col] = 0;
        }
      }
    }
  }

  p5.setup = () => {
    p5.createCanvas(gridWidth, gridHeight);
    p5.frameRate(speed);

    p5.setGridRandom();
    p5.setStyle();
    p5.getRules();

    p5.noLoop();
  }

  p5.draw = () => {
    p5.background(0);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const CURRENT_STATE = nextGrid[row][col];
        if (CURRENT_STATE) {
          p5.fill(STATE_COLORS[CURRENT_STATE]);
          p5.rect(row * cellWidth, col * cellWidth, cellWidth, cellWidth);
          grid[row][col] = CURRENT_STATE;
        } else {
          p5.fill(0);
          grid[row][col] = CURRENT_STATE;
        }
        nextGrid[row][col] = 0;
      }
    }

    p5.gridStep();
    p5.loop();
  }
}
