import React from 'react';
import PropTypes from 'prop-types';
import { Stage } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

import { Automaton } from 'golem';
import GolemCells from './golemCells';

PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.GC_MODE = PIXI.GC_MODES.MANUAL;

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 400;

const GolemStage = class extends React.Component {
  constructor(props) {
    super(props);

    const { cellSize } = this.props;
    const rows = Math.floor((MAX_HEIGHT - 4) / cellSize);
    const cols = Math.min(
      MAX_WIDTH / cellSize,
      Math.floor((document.body.clientWidth - 4) / cellSize),
    );

    this.state = {
      width: cols * cellSize,
      height: rows * cellSize,
      backgroundColor: 0x212121,
      rows,
      cols,
      automaton: Automaton.new(rows, cols),
      displayObj: new PIXI.Graphics(),
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentDidUpdate(prevProps) {
    const { cellSize, rules } = this.props;
    const { automaton } = this.state;

    if (cellSize !== prevProps.cellSize) {
      this.onResize();
    }
    if (rules !== prevProps.rules) {
      automaton.set_survival_rule(rules.survival);
      automaton.set_birth_rule(rules.birth);
      automaton.set_generation_rule(rules.generation);
    }
  }

  componentWillUnmount() {
    const { automaton, displayObj } = this.state;
    automaton.free();
    displayObj.destroy();
  }

  // TODO: resize automaton
  onResize = () => {
    const { cellSize } = this.props;
    const rows = Math.floor((MAX_HEIGHT - 4) / cellSize);
    const cols = Math.min(
      MAX_WIDTH / cellSize,
      Math.floor((document.body.clientWidth - 4) / cellSize),
    );

    this.setState({
      width: cols * cellSize,
      height: rows * cellSize,
      rows,
      cols,
    });
  }

  render() {
    const {
      cellSize, stepSize, isPaused, grid, colors,
    } = this.props;
    const {
      width, height, backgroundColor, rows, cols, automaton, displayObj,
    } = this.state;

    return (
      <Stage
        width={width}
        height={height}
        options={{
          backgroundColor,
          autoDensity: true,
          forceFXAA: true,
        }}
        className="golem-stage"
      >
        <GolemCells
          cellSize={cellSize}
          stepSize={stepSize}
          isPaused={isPaused}
          grid={grid}
          colors={colors}
          rows={rows}
          cols={cols}
          automaton={automaton}
          displayObj={displayObj}
        />
      </Stage>
    );
  }
};

export default GolemStage;

GolemStage.propTypes = {
  cellSize: PropTypes.number.isRequired,
  stepSize: PropTypes.number.isRequired,
  rules: PropTypes.exact({
    survival: PropTypes.arrayOf(PropTypes.number).isRequired,
    birth: PropTypes.arrayOf(PropTypes.number).isRequired,
    generation: PropTypes.number.isRequired,
  }).isRequired,
  isPaused: PropTypes.bool.isRequired,
  grid: PropTypes.bool.isRequired,
  colors: PropTypes.arrayOf(PropTypes.number).isRequired,
};
