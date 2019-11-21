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
      birthRule: [3],
      survivalRule: [2, 3],
      generationRule: 2,
      gridIsLooping: false,
      buttonClick: ''
    };
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
   * set the initial rule input value
   */
  onGolemOptionsDidMount = () => {
    const RULES_ELEMENT = document.getElementById('golem-options-rules');
    RULES_ELEMENT.value = `${this.state.birthRule.join('')}/${this.state.survivalRule.join('')}/${this.state.generationRule}`
  }

  /**
   * set rule states to pass to the P5Wrapper if input string is valid
   */
  onRulesInput = () => {
    const RULES_ELEMENT = document.getElementById('golem-options-rules');
    const RULES_VALUE = RULES_ELEMENT.value;
    const RULES_ARRAY = RULES_VALUE.match(/-?[0-9]+/g);
    let birthRule, survivalRule, generationRule;

    if (RULES_ARRAY === null || RULES_ARRAY.length !== 3) {
      RULES_ELEMENT.classList.add('golem-input-text-invalid');
    } else {
      birthRule = RULES_ARRAY[0].split('').map(n => parseInt(n, 10));

      if (RULES_ARRAY[1].match(/-1/)) {
        if (RULES_ARRAY[1].length === 2) {
          survivalRule = [-1];
        } else {
          survivalRule = [9];
        }
      } else {
        survivalRule = RULES_ARRAY[1].split('').map(n => parseInt(n, 10));
      }

      generationRule = parseInt(RULES_ARRAY[2], 10);

      if (birthRule.every(n => n >= 1 && n <= 8)
      && survivalRule.every(n => n >= -1 && n <= 8)
      && generationRule >= 2) {
        RULES_ELEMENT.classList.remove('golem-input-text-invalid');
        this.setState({
          birthRule: birthRule,
          survivalRule: survivalRule,
          generationRule: generationRule
        });
      } else {
        RULES_ELEMENT.classList.add('golem-input-text-invalid');
      }
    }
  }

  /**
   * get the compactRules from the selected option in the rule select element;
   * set the rules textbox placeholder to the preset rules
   */
  onSelectRulesChange = () => {
    const SELECT_ELEMENT = document.getElementById('golem-options-presets');
    document.getElementById('golem-options-rules').value = SELECT_ELEMENT.options[SELECT_ELEMENT.selectedIndex].value;

    this.onRulesInput();
  }

  /**
   * set the gridIsLooping state to pass to the P5Wrapper; set button attributes
   */
  onStartPauseClick = () => {
    this.setState({
      gridIsLooping: !this.state.gridIsLooping
    }, this.setStartPause);
  }

  /**
   * set the start/pause button value
   */
  setStartPause = () => {
    const START_BUTTON = document.getElementById('golem-options-start');
    const STEP_BUTTON = document.getElementById('golem-options-step');

    if (this.state.gridIsLooping) {
      START_BUTTON.value = 'Pause';
      STEP_BUTTON.disabled = true;
    } else {
      START_BUTTON.value = 'Start';
      STEP_BUTTON.disabled = false;
    }
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
          birthRule={this.state.birthRule}
          survivalRule={this.state.survivalRule}
          generationRule={this.state.generationRule}
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
            onButtonClick={this.onButtonClick}
            onGolemOptionsDidMount={this.onGolemOptionsDidMount}
            onRulesInput={this.onRulesInput}
            onSelectRulesChange={this.onSelectRulesChange}
            onStartPauseClick={this.onStartPauseClick}
            setStartPause={this.setStartPause}
          />
        </div>
      </div>
    );
  }
}
