import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css';
import './scss/style.scss';
import CASMain from './components/cas-main';

// render the main component into the DOM in #root
ReactDOM.render(
  <CASMain/>,
  document.getElementById('root')
);
