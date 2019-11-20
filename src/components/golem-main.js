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
      buttonClick: ''
    };
  }

  /**
   * set the buttonClick state to pass to the P5Wrapper
   * @param button [string] the button that was pressed
   */
  onButtonClick = (button) => {
    this.setState({
      buttonClick: button
    }, this.resetButtonClickState);
  }

  /**
   * immediately reset the buttonClick state to perform a single action
   */
  resetButtonClickState = () => {
    this.setState({
      buttonClick: ''
    });
  }

  /**
   * get the compactRules from the selected option in the rule select element
   */
  onSelectRulesChange = () => {
    const SELECT_ELEMENT = document.getElementsByClassName('golem-input-select')[0];

    this.setState({
      compactRules: SELECT_ELEMENT.options[SELECT_ELEMENT.selectedIndex].value
    }, this.setRulesPlaceholder);
  }

  /**
   * clear the rules text input and set the placeholder to the compactRules
   * state
   */
  setRulesPlaceholder = () => {
    document.getElementsByClassName('golem-input-text')[0].placeholder = this.state.compactRules;
  }

  render() {
    return (
      <div className="golem-main">
        <div className="golem-h1-wrapper">
          <h1 className="golem-h1">Cellular Automaton</h1>
        </div>
        <P5Wrapper
          sketch={this.state.grid}
          speed={this.state.speed}
          compactRules={this.state.compactRules}
          buttonClick={this.state.buttonClick}
        />
        <div className="golem-control">
          <div className="golem-stats">
            <span>Generations: -{/*{this.state.generation}*/}</span>
            <span>Speed: -{/*{this.state.speed}*/} steps/s</span>
          </div>
          <GolemOptions
            compactRules={this.state.compactRules}
            onButtonClick={this.onButtonClick}
            onSelectRulesChange={this.onSelectRulesChange}
          />
        </div>
      </div>
    );
  }
}
