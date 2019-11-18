import React from 'react';
import P5Wrapper from 'react-p5-wrapper';
import CASGrid from './cas-grid';

class CASMain extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      grid: CASGrid
    };
  }

  render() {
    return (
      <div className="cas-main">
        {/* <h1 className="cas-h1">Cellular Automaton</h1> */}
        <P5Wrapper
          sketch={this.state.grid}
        />
        <div className="cas-info">
          <div className="cas-states">
            {/* <span>Generations: {this.state.generation}</span>
            <span>Speed (steps/s): {this.state.speed}</span> */}
          </div>
          <div className="cas-options">
            <div className="cas-options-row">
              {/* <button className="cas-button cas-button-main" onClick={() => this.onRandomizeClick()}>Randomize</button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CASMain;
