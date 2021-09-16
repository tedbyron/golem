import loadable from '@loadable/component'
import * as PIXI from 'pixi.js'
import React from 'react'

import GolemStats from '../components/golem-stats'
import GolemOptions from '../components/golem-options'
import Layout from '../components/layout'

const GolemStage = loadable(() => import('../components/golem-stage'))

const MAX_WIDTH = 1200
const MAX_HEIGHT = 400

const IndexPage = class extends React.Component {
  constructor (props) {
    super(props)

    // generate colors for first 25 cell states
    const colors = [0x212121, 0xffd600]
    for (let i = 0; i < 25; i += 1) {
      colors.push(parseInt(Math.floor(Math.random() * 16777215).toString(16), 16))
    }

    this.state = {
      cellSize: 5,
      stepSize: 1,
      rules: { // TODO
        survival: [2, 3],
        birth: [3],
        generation: 2
      },
      generation: 0, // TODO
      paused: false,
      grid: false, // TODO
      colors
    }

    this.ticker = PIXI.Ticker.shared
  }

  // TODO: this needs to be replaced by checking PIXI.Ticker.shared.started
  startStop = () => {
    this.setState((state) => ({
      paused: !state.paused
    }), () => {
      const { paused } = this.state

      if (paused) {
        this.ticker.stop()
      } else {
        this.ticker.start()
      }
    })
  }

  step = () => {}

  render () {
    const { cellSize, stepSize, rules, generation, paused, grid, colors } = this.state

    return (
      <Layout>
        <section>
          <div className='golem-heading-wrapper'>
            <h1 className='golem-heading'>Golem</h1>
          </div>

          {typeof document !== 'undefined' && (
            <GolemStage
              cellSize={cellSize}
              stepSize={stepSize}
              rules={rules}
              paused={paused}
              grid={grid}
              colors={colors}
              fallback={(
                <div
                  className='golem-stage-fallback'
                  style={{
                    width: Math.min(
                      MAX_WIDTH,
                      Math.floor((document.body.clientWidth - 4) / cellSize) * cellSize
                    ),
                    height: Math.floor((MAX_HEIGHT - 4) / cellSize) * cellSize
                  }}
                >
                  <span>Loading…</span>
                </div>
              )}
            />
          )}

          <div className='golem-control'>
            <GolemStats
              generation={generation}
            />
            <GolemOptions
              paused={paused}
              handleStartStop={this.startStop}
              handleStep={this.step}
            />
          </div>
        </section>
      </Layout>
    )
  }
}

export default IndexPage
