import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css';
import './scss/style.scss';
import GolemMain from './components/golem-main';

// render the main component into the DOM in #root
ReactDOM.render(
  <GolemMain/>,
  document.getElementById('root')
);
