import React from 'react';
import PropTypes from 'prop-types';
import { createStageClass } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

import GolemCells from './golemCells';

import { Automaton } from '../../rs/pkg/golem';

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 400;

const Stage = createStageClass();

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

    const { automaton } = this.state;
    automaton.randomize_cells(25); // TODO
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
  }

  componentDidUpdate(prevProps) {
    const { cellSize } = this.props;

    if (cellSize !== prevProps.cellSize) {
      this.onCellSizeChange(cellSize);
    }
  }

  componentWillUnmount() {
    const { automaton, displayObj } = this.state;
    automaton.free();
    displayObj.destroy();
  }

  onCellSizeChange = (cellSize) => {
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
    }, () => {
      const { automaton } = this.state;
      automaton.resize_width(cols);
      automaton.resize_height(rows);
    });
  }

  onWindowResize = () => {
    const { cellSize } = this.props;
    const { automaton } = this.state;
    const cols = Math.min(
      MAX_WIDTH / cellSize,
      Math.floor((document.body.clientWidth - 4) / cellSize),
    );

    automaton.resize_width(cols);

    this.setState({
      width: cols * cellSize,
      cols,
    });
  }

  render() {
    const { cellSize, colors } = this.props;
    const {
      width, height, backgroundColor, rows, cols, automaton, displayObj,
    } = this.state;

    return (
      <Stage
        options={{ width, height, backgroundColor }}
        className="golem-stage"
      >
        <GolemCells
          cellSize={cellSize}
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
  colors: PropTypes.arrayOf(PropTypes.number).isRequired,
};
