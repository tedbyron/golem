import React from 'react'

import GolemStage from '../components/golem-stage'
import GolemStats from '../components/golem-stats'
import GolemOptions from '../components/golem-options'
import Layout from '../components/layout'

const IndexPage = class extends React.Component {
  constructor (props) {
    super(props)

    // generate colors for first 25 cell states
    const colors = [0x212121, 0xffd600]
    for (let i = 0; i < 23; i += 1) {
      colors.push(parseInt(Math.floor(Math.random() * 16777215).toString(16), 16))
    }

    this.state = {
      cellSize: 5,
      rules: { // TODO
        birth: [3],
        survival: [2, 3],
        generation: 2
      },
      colors
    }
  }

  startStop = () => {}
  step = () => {}

  render () {
    const { cellSize, rules, colors } = this.state

    return (
      <Layout>
        <section>
          <div className='golem-heading-wrapper'>
            <h1 className='golem-heading'>Golem</h1>
          </div>

          {typeof document !== 'undefined' && (
            <GolemStage
              cellSize={cellSize}
              rules={rules}
              colors={colors}
            />
          )}

          <div className='golem-control'>
            <GolemStats />
            <GolemOptions
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
