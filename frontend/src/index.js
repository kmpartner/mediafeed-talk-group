import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';

import configureUiStore from './hook-store/ui-store';
import configureAdStore from './hook-store/ad-store';
import configureShareStore from './hook-store/share-store';
import configureGroupStore from './hook-store/group-store';

configureUiStore();
configureAdStore();
configureShareStore();
configureGroupStore();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
