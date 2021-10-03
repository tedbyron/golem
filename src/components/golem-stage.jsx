import { Stage } from '@inlet/react-pixi'
import { Automaton } from 'golem'
import * as PIXI from 'pixi.js'
import PropTypes from 'prop-types'
import React from 'react'

import GolemCells from './golem-cells'

PIXI.settings.RESOLUTION = window.devicePixelRatio
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
PIXI.settings.GC_MODE = PIXI.GC_MODES.MANUAL

const MAX_WIDTH = 1200
const MAX_HEIGHT = 400

const GolemStage = class extends React.Component {
  constructor (props) {
    super(props)

    const { cellSize } = this.props
    const rows = Math.floor((MAX_HEIGHT - 4) / cellSize)
    const cols = Math.min(
      MAX_WIDTH / cellSize,
      Math.floor((document.body.clientWidth - 4) / cellSize)
    )

    this.state = {
      width: cols * cellSize,
      height: rows * cellSize,
      backgroundColor: 0x212121,
      rows,
      cols,
      automaton: new Automaton(rows, cols)
    }

    const { automaton } = this.state
    automaton.randomizeCells(0.5)
  }

  componentDidMount () {
    window.addEventListener('resize', this.resize)
  }

  componentDidUpdate (prevProps) {
    const { cellSize, rules } = this.props
    const { automaton } = this.state

    if (cellSize !== prevProps.cellSize) {
      this.resize()
    }
    if (rules !== prevProps.rules) {
      automaton.rules.birth = rules.birth
      automaton.rules.survival = rules.survival
      automaton.rules.generation = rules.generation
    }
  }

  // TODO: resize automaton
  resize = () => {
    const { cellSize } = this.props
    const rows = Math.floor((MAX_HEIGHT - 4) / cellSize)
    const cols = Math.min(
      MAX_WIDTH / cellSize,
      Math.floor((document.body.clientWidth - 4) / cellSize)
    )

    this.setState({
      width: cols * cellSize,
      height: rows * cellSize,
      rows,
      cols
    })
  }

  render () {
    const { cellSize, grid, colors } = this.props
    const { width, height, backgroundColor, rows, cols, automaton } = this.state
    const area = rows * cols

    return (
      <Stage
        width={width}
        height={height}
        options={{
          backgroundColor,
          autoDensity: true,
          forceFXAA: true
        }}
        className='golem-stage'
      >
        <GolemCells
          cellSize={cellSize}
          grid={grid}
          colors={colors}
          rows={rows}
          cols={cols}
          cellsPtr={automaton.getCellsPtr()}
          area={area}
        />
      </Stage>
    )
  }
}

export default GolemStage

GolemStage.propTypes = {
  cellSize: PropTypes.number.isRequired,
  rules: PropTypes.exact({
    birth: PropTypes.arrayOf(PropTypes.number).isRequired,
    survival: PropTypes.arrayOf(PropTypes.number).isRequired,
    generation: PropTypes.number.isRequired
  }).isRequired,
  colors: PropTypes.arrayOf(PropTypes.number).isRequired
}
