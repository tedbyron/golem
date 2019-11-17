import React from 'react';

function CASCell(props) {
  return (
    <td
      className={`cas-cell cas-cell-${props.state}`}
      style={{width: props.cellLength, height: props.cellLength}}
      onMouseEnter={() => props.onMouseEnter()}
    >
    </td>
  );
}

class CASRow extends React.Component {
  renderCell(row, col, state) {
    return (
      <CASCell
        key={col}
        state={state}
        cellLength={this.props.cellLength}
        onMouseEnter={() => this.props.onMouseEnter(row, col)}
      />
    );
  }

  render() {
    const cells = [];
    for (let j = 0; j < this.props.cols; j++) {
      cells.push(this.renderCell(this.props.row, j, this.props.state[this.props.row][j]));
    }

    return (
      <tr>{cells}</tr>
    );
  }
}

class CASGrid extends React.Component {
  renderRow(row) {
    return (
      <CASRow
        key={row}
        row={row}
        cols={this.props.cols}
        state={this.props.state}
        cellLength={this.props.cellLength}
        onMouseEnter={(row, col) => this.props.onMouseEnter(row, col)}
      />
    );
  }

  render() {
    const rows = [];
    for (let i = 0; i < this.props.rows; i++) {
      rows.push(this.renderRow(i));
    }

    return (
      <div className="cas-grid-container">
        <table className="cas-grid">
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

class CASMain extends React.Component {
  constructor(props) {
    super(props);

    this.speed  = 1000;   // time (ms) for generation to increase by 1
    this.rows   = 100;    // number of rows in the grid
    this.cols   = 150;    // number of columns in the grid
    this.rmbDown = 0;
    this.state  = {
      generation:   0,    // grid generation
      survivalRule: '23', // number of required neighbors to survive
      birthRule:    '3',  // number of required neighbors to revive
      stateRule:    '2',  // number of possible cell states
      gridState:    new Array(this.rows).fill(new Array(this.cols).fill(undefined))
    };

    document.body.addEventListener('mousedown', () => {
      this.rmbDown = 1;
    });

    document.body.addEventListener('mouseup', () => {
      this.rmbDown = 0;
    });

    document.body.addEventListener('mouseleave', () => {
      this.rmbDown = 0;
    })
  }

  onMouseEnter(row, col) {
    if (this.rmbDown) {
      console.log(row,col);
    }
  }

  onRandomizeClick() {
    this.setState({
      generation: 0,
      gridState: this.state.gridState.map(row => row.map(() => Math.floor(Math.random() * parseInt(this.state.stateRule, 10))))
    });
  }

  onResetClick() {
    this.setState({
      generation:   0,    // grid generation
      survivalRule: '23', // number of required neighbors to survive
      birthRule:    '3',  // number of required neighbors to revive
      stateRule:    '2',  // number of possible cell states
      gridState:    new Array(this.rows).fill(new Array(this.cols).fill(undefined))
    });
  }

  render() {
    return (
      <div className="cas-main">
        <h1 className="cas-h1">Cellular Automaton</h1>
        <CASGrid
          rows={this.rows}
          cols={this.cols}
          survivalRule={this.survivalRule}
          birthRule={this.birthRule}
          stateRule={this.stateRule}
          state={this.state.gridState}
          cellLength={document.documentElement.clientWidth / this.cols}
          onMouseEnter={(row, col) => this.onMouseEnter(row, col)}
        />
        <div className="cas-info">
          <h2 className="cas-h2">Generations: {this.state.generation}</h2>
          <div className="cas-options">
            <div className="cas-options-row">
              <button className="cas-button cas-button-main" onClick={() => this.onRandomizeClick()}>Randomize</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CASMain;
