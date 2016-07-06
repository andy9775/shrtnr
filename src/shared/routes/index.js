/*
Main react router routes configuration
*/
import {Route, IndexRoute} from 'react-router';
import React from 'react';

import {Main, Home} from '../components';


export default (
  <Route
    name="Main"
    component={Main}
    path="/">

    <IndexRoute
      name="Home"
      component={Home} />

  </Route>
)
