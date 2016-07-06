/*
Main client side entry file
*/
import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from '../shared/routes';

render(
  <Router children={routes}
          history={browserHistory} />,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
