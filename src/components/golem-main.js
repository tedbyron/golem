import React from 'react';
import P5Wrapper from 'react-p5-wrapper';
import GolemGrid from './golem-grid';

export default class GolemMain extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      grid: GolemGrid
    };
  }

  render() {
    return (
      <div className="golem-main">
        {/* <h1 className="golem-h1">Cellular Automaton</h1> */}
        <P5Wrapper
          sketch={this.state.grid}
        />
        <div className="golem-info">
          <div className="golem-states">
            {/* <span>Generations: {this.state.generation}</span>
            <span>Speed (steps/s): {this.state.speed}</span> */}
          </div>
          <div className="golem-options">
            <div className="golem-options-row">
              {/* <button className="golem-button golem-button-main" onClick={() => this.onRandomizeClick()}>Randomize</button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
