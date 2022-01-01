import { Stage } from '@inlet/react-pixi'
import { Automaton } from 'golem'
import * as PIXI from 'pixi.js'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import GolemCells from './golem-cells'

PIXI.settings.RESOLUTION = window.devicePixelRatio
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
PIXI.settings.ROUND_PIXELS = true
PIXI.settings.GC_MODE = PIXI.GC_MODES.MANUAL

const MAX_WIDTH = 1200
const MAX_HEIGHT = 400
const BG_COLOR = 0x212121

const GolemStage = ({ cellSize, rules, run, colors }) => {
  const [rows, setRows] = useState(Math.floor((MAX_HEIGHT - 4) / cellSize))
  const [cols, setCols] = useState(Math.min(
    MAX_WIDTH / cellSize,
    Math.floor((document.body.clientWidth - 4) / cellSize)
  ))
  const [width, setWidth] = useState(cols * cellSize)
  const [height, setHeight] = useState(rows * cellSize)

  const [automaton] = useState(new Automaton(rows, cols))

  const resize = () => {
    setRows(Math.floor((MAX_HEIGHT - 4) / cellSize))
    setCols(Math.min(
      MAX_WIDTH / cellSize,
      Math.floor((document.body.clientWidth - 4) / cellSize)
    ))
    setWidth(cols * cellSize)
    setHeight(rows * cellSize)
  }

  useEffect(() => {
    automaton.randomizeCells(0.5)
    window.addEventListener('resize', resize)

    return () => { automaton.free() }
  }, [])

  useEffect(() => {
    resize()
  }, [cellSize])

  useEffect(() => {
    automaton.rules.birth = rules.birth
    automaton.rules.survival = rules.survival
    automaton.rules.generation = rules.generation
  }, [rules])

  useEffect(() => {
    if (run) {
      PIXI.Ticker.shared.start()
    } else {
      PIXI.Ticker.shared.stop()
    }
  }, [run])

  return (
    <Stage
      width={width}
      height={height}
      options={{
        backgroundColor: BG_COLOR,
        autoDensity: true,
        sharedTicker: true
      }}
      className='golem-stage'
    >
      <GolemCells
        cellSize={cellSize}
        colors={colors}
        rows={rows}
        cols={cols}
        automaton={automaton}
        area={rows * cols}
      />
    </Stage>
  )
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
