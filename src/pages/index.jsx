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
    this.state = {
      cellSize: 5,
      generation: 0, // TODO
      colors: [
        0xffd600,
      ],
      grid: false, // TODO
    };
  }

  render() {
    const { cellSize, colors, grid } = this.state;

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
                colors={colors}
                grid={grid}
              />
            </Suspense>
          )}


          <div className="golem-control">
            <GolemStats />
            <GolemOptions />
          </div>
        </section>
      </Layout>
    );
  }
};

export default IndexPage;
