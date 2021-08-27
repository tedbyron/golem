import React from 'react';
// import loadable from '@loadable/component';
import { Automaton } from '@tedbyron/ca/cellular_automaton';
import { memory } from '@tedbyron/ca/cellular_automaton_bg.wasm';

import Layout from './layout';

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 400;

const IndexPage = class extends React.Component {
  constructor(props) {
    super(props);

    // generate colors for first 25 cell states
    const colors = [0x212121, 0xffd600];
    for (let i = 0; i < 25; i += 1) {
      colors.push(parseInt(Math.floor(Math.random() * 16777215).toString(16), 16));
    }

    this.state = {
      cellSize: 5,
      // stepSize: 1,
      // rules: {
      //   survival: [2, 3],
      //   birth: [3],
      //   generation: 2,
      // },
      // generation: 0, // TODO
      // isPaused: false,
      // grid: false, // TODO
      // colors,
      automaton: undefined,
    };
  }

  componentDidMount = () => {
    const { cellSize } = this.state;
    const rows = Math.floor((MAX_HEIGHT - 4) / cellSize);
    const cols = Math.min(
      MAX_WIDTH / cellSize,
      Math.floor((document.body.clientWidth - 4) / cellSize),
    );

    this.setState(() => ({
      automaton: new Automaton(rows, cols),
    }), () => {
      const { automaton } = this.state;
      automaton.randomizeCells(50);
    });
  }

  render() {
    return (
      <Layout>
        <section>
          <div className="golem-heading-wrapper">
            <h1 className="golem-heading">Golem</h1>
          </div>

          <p>hello idiot</p>
        </section>
      </Layout>
    );
  }
};

export default IndexPage;
