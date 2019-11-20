import React from 'react';
import P5Wrapper from 'react-p5-wrapper';

import GolemGrid from './golem-grid';
import GolemOptions from './golem-options';

export default class GolemMain extends React.Component {
  /**
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state  = {
      grid: GolemGrid,
      generation: 0,
      speed: 30,
      compactRules: '3/23/2',
      gridIsLooping: false,
      buttonClick: ''
    };
  }

  /**
   * set the gridIsLooping state to pass to the P5Wrapper; set button attributes
   */
  onStartStopClick = () => {
    this.setState({
      gridIsLooping: !this.state.gridIsLooping
    }, () => {
      const START_BUTTON = document.getElementById('golem-options-start');
      const STEP_BUTTON = document.getElementById('golem-options-step');

      if (this.state.gridIsLooping) {
        START_BUTTON.value = 'Pause';
        STEP_BUTTON.disabled = true;
      } else {
        START_BUTTON.value = 'Start';
        STEP_BUTTON.disabled = false;
      }
    });
  }

  /**
   * set the buttonClick state to pass to the P5Wrapper; reset buttonClick state
   * @param button [string] the button that was pressed
   */
  onButtonClick = (button) => {
    this.setState({
      buttonClick: button
    }, () => {
      this.setState({
        buttonClick: ''
      });
    });
  }

  /**
   * get the compactRules from the selected option in the rule select element;
   * set the rules textbox placeholder to the preset rules
   */
  onSelectRulesChange = () => {
    const SELECT_ELEMENT = document.getElementsByClassName('golem-input-select')[0];

    this.setState({
      compactRules: SELECT_ELEMENT.options[SELECT_ELEMENT.selectedIndex].value
    }, () => {
      document.getElementsByClassName('golem-input-text')[0].placeholder = this.state.compactRules
    });
  }

  render() {
    return (
      <div className="golem-main">
        <div className="golem-heading-wrapper">
          <span className="golem-heading">Cellular Automaton</span>
        </div>
        <P5Wrapper
          sketch={this.state.grid}
          speed={this.state.speed}
          compactRules={this.state.compactRules}
          gridIsLooping={this.state.gridIsLooping}
          buttonClick={this.state.buttonClick}
        />
        <div className="golem-control">
          <div className="golem-stats">
            <span>Generations: -{/*{this.state.generation}*/}</span>
            <span>Speed: -{/*{this.state.speed}*/} steps/s</span>
          </div>
          <GolemOptions
            compactRules={this.state.compactRules}
            onStartStopClick={this.onStartStopClick}
            onButtonClick={this.onButtonClick}
            onSelectRulesChange={this.onSelectRulesChange}
          />
        </div>
      </div>
    );
  }
}
