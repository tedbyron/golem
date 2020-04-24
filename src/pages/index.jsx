import React, { Suspense } from 'react';

import Layout from '../components/layout';
import GolemStats from '../components/golemStats';
import GolemOptions from '../components/golemOptions';

const GolemStage = React.lazy(() => import('../components/golemStage'));

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 400;

const IndexPage = class extends React.Component {
  constructor(props) {
    super(props);

    const colors = [0x212121, 0xffd600];

    for (let i = 0; i < 25; i += 1) {
      colors.push(
        parseInt(`${Math.floor(Math.random() * 251).toString(16)}${Math.floor(Math.random() * 251).toString(16)}${Math.floor(Math.random() * 251).toString(16)}`, 16),
      );
    }

    this.state = {
      cellSize: 5,
      stepSize: 1,
      rules: { // TODO
        survival: [2, 3],
        birth: [3],
        generation: 2,
      },
      generation: 0, // TODO
      isPaused: false,
      grid: false, // TODO
      colors,
    };
  }

  onStartPauseClick = () => {
    this.setState((state) => ({
      isPaused: !state.isPaused,
    }));
  }

  render() {
    const {
      cellSize, stepSize, rules, generation, isPaused, grid, colors,
    } = this.state;

    return (
      <Layout>
        <section>
          <div className="golem-heading-wrapper">
            <h1 className="golem-heading">Golem</h1>
          </div>

          { typeof document !== 'undefined' && (
            <Suspense
              fallback={(
                <div
                  className="golem-stage-fallback"
                  style={{
                    width: Math.min(
                      MAX_WIDTH,
                      Math.floor((document.body.clientWidth - 4) / cellSize) * cellSize,
                    ),
                    height: Math.floor((MAX_HEIGHT - 4) / cellSize) * cellSize,
                  }}
                >
                  <span>Loading...</span>
                </div>
              )}
            >
              <GolemStage
                cellSize={cellSize}
                stepSize={stepSize}
                rules={rules}
                isPaused={isPaused}
                grid={grid}
                colors={colors}
              />
            </Suspense>
          )}


          <div className="golem-control">
            <GolemStats
              generation={generation}
            />
            <GolemOptions
              isPaused={isPaused}
              onStartPauseClick={this.onStartPauseClick}
            />
          </div>
        </section>
      </Layout>
    );
  }
};

export default IndexPage;
