import React from 'react';
import PropTypes from 'prop-types';
import { createStageClass } from 'react-pixi-fiber';

import GolemCells from './golemCells';
import { Automaton } from '../../rs/pkg/golem';

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 400;

const Stage = createStageClass();

const GolemStage = class extends React.Component {
  constructor(props) {
    super(props);
    const { cellSize } = this.props;
    this.state = {
      width: Math.min(
        MAX_WIDTH,
        Math.floor((document.body.clientWidth - 4) / cellSize) * cellSize,
      ),
      height: Math.floor((MAX_HEIGHT - 4) / cellSize) * cellSize,
      backgroundColor: 0x212121,
      rows: Math.floor((MAX_HEIGHT - 4) / cellSize),
      cols: Math.min(
        MAX_WIDTH / cellSize,
        Math.floor((document.body.clientWidth - 4) / cellSize),
      ),
    };

    const { rows, cols } = this.state;
    this.automaton = Automaton.new(rows, cols);
    this.automaton.randomize_cells(25); // TODO
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
  }

  componentDidUpdate(prevProps, prevState) {
    const { cellSize } = this.props;
    const {
      width, height, rows, cols,
    } = this.state;

    if (cellSize !== prevProps.cellSize) {
      this.onCellSizeChange(cellSize);
    }
    if (width !== prevState.width) {
      this.automaton.resize_width(cols);
    }
    if (height !== prevState.height) {
      this.automaton.resize_height(rows);
    }
  }

  onCellSizeChange = (cellSize) => {
    this.setState(() => ({
      width: Math.min(
        MAX_WIDTH,
        Math.floor((document.body.clientWidth - 4) / cellSize) * cellSize,
      ),
      height: Math.floor((MAX_HEIGHT - 4) / cellSize) * cellSize,
    }));
  }

  onWindowResize = () => {
    this.setState((_, props) => ({
      width: Math.min(
        MAX_WIDTH,
        Math.floor((document.body.clientWidth - 4) / props.cellSize) * props.cellSize,
      ),
      cols: Math.min(
        MAX_WIDTH / props.cellSize,
        Math.floor((document.body.clientWidth - 4) / props.cellSize),
      ),
    }));
  }

  render() {
    const { cellSize, colors } = this.props;
    const {
      width, height, backgroundColor, rows, cols,
    } = this.state;

    return (
      <Stage
        options={{ width, height, backgroundColor }}
        className="golem-stage"
      >
        <GolemCells
          rows={cols}
          cols={rows}
          cellsPtr={this.automaton.cells()}
          cellSize={cellSize}
          colors={colors}
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
