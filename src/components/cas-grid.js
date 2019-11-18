export default function casGrid(p5) {
  const MAX_STATES = 20;
  let rows = 75;
  let cols = 125;
  let speed = 24;
  let rules = '23, 3, 2';
  let survivalRule, birthRule, stateRule, grid, nextGrid, gridWidth, cellWidth, gridHeight;
  let stateColors = [];

  p5.setGridSize = () => {
    gridWidth = 800; // TODO: fix this shit
    cellWidth = gridWidth / cols;
    gridHeight = cellWidth * rows;
  }

  p5.resetGrids = () => {
    grid = [];
    nextGrid = [];

    for (let row = 0; row < rows; row++) {
      grid[row] = [];
      nextGrid[row] = [];
      for (let col = 0; col < cols; col++) {
        grid[row][col] = 0;
        nextGrid[row][col] = (Math.random() * 2)|0;
      }
    }
  }

  p5.setRules = () => {
    let rulesArray = rules.match(/[0-9]+/g);

    survivalRule = rulesArray[0].split('');
    for (let i = 0; i < survivalRule.length; i++) {
      survivalRule[i] = ~~survivalRule[i];
    }

    birthRule = rulesArray[1].split('');
    for (let i = 0; i < birthRule.length; i++) {
      birthRule[i] = ~~birthRule[i] - 1; // TODO: idk???
    }

    stateRule = Math.min(MAX_STATES, rulesArray[2]);

    if (stateRule === 2) {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (nextGrid[row][col] > 1) {
            nextGrid[row][col] = 0;
          }
        }
      }
    }
  }

  p5.getNeighborCount = (row, col) => {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < cols && grid[row + i][col + j]) {
          count++;
        }
      }
    }

    return --count;
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
        } else if (CURRENT_STATE && (CURRENT_STATE < stateRule - 1 || stateRule === 2)) {
          let neighborCount = survivalRule
            ? NEIGHBOR_COUNT
            : 0;
          let shouldSurvive = survivalRule.includes(neighborCount);

          if (CURRENT_STATE === 1 && shouldSurvive) {
            nextGrid[row][col] = CURRENT_STATE;
          } else if (!shouldSurvive) {
            nextGrid[row][col] = (CURRENT_STATE + 1) % stateRule;
          }

          if (CURRENT_STATE > 1) {
            nextGrid[row][col] = CURRENT_STATE + 1;
          }
        } else if (CURRENT_STATE >= stateRule - 1) {
          nextGrid[row][col] = 0;
        }
      }
    }
  }

  p5.setup = () => {
    window.addEventListener('resize', () => {
      p5.setGridSize();
      p5.resizeCanvas(gridWidth, gridHeight);
    });

    p5.setGridSize();
    p5.createCanvas(gridWidth, gridHeight);
    p5.noStroke();
    p5.frameRate(speed);
    p5.resetGrids();

    stateColors.push(p5.color(255), p5.color(240, 200, 40));
    for (let i = 0; i < 20; i++) {
      stateColors.push(p5.color((Math.random() * 250)|0, (Math.random() * 250)|0, (Math.random() * 250)|0));
    }

    p5.setRules();
    p5.noLoop();
  }

  p5.draw = () => {
    p5.background(0);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const CURRENT_STATE = nextGrid[row][col];
        if (CURRENT_STATE) {
          p5.fill(stateColors[CURRENT_STATE]);
          grid[row][col] = CURRENT_STATE;
        } else {
          p5.fill(0);
          grid[row][col] = CURRENT_STATE;
        }
        nextGrid[row][col] = 0;
        p5.stroke(0);
        p5.rect(row * cellWidth, col * cellWidth, cellWidth, cellWidth);
      }
    }

    p5.gridStep();
    p5.loop();
  }
}
