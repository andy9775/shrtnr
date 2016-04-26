/// <reference path="react-router/react-router.d.ts" />
import React from 'react';
import {match, RouterContext} from 'react-router';
import {Provider} from 'react-redux';
import Promise from 'bluebird';
import ReactDOMServer from 'react-dom/server';

export const ERROR_TYPES = {
  ROUTE_ERROR: 'ROUTE_ERROR',
  NO_RENDER_PROPS: 'NO_RENDER_PROPS'
};

/**
 * A helper function for react-router routes which renders the component for 
 * the specified route
 * 
 * 
 * @param routes {Routes} - react-router route configuration
 * @param location {String} - router path (req.url)
 * @param store {Redux Store} - The redux store
 * @returns {Promise} - A promise which resolves the rendered component and the 
 * store (as a JSON string)
 */
export function routerMatch(routes, location, store) {
  return new Promise((resolve, reject) => {
    match({ routes, location }, (routeError, redirectLocation, renderProps) => {
      if (routeError) {
        reject({ type: ERROR_TYPES.ROUTE_ERROR, error: routeError });
      } else if (redirectLocation) {
        resolve({ redirect: redirectLocation });
      } else if (renderProps) {
         
        let renderedComponent; 
        if (store){
        renderedComponent =  ReactDOMServer.renderToString(
            <Provider store={store}>
              <RouterContext {...renderProps}/>
            </Provider >
          );
      } else {
        renderedComponent = ReactDOMServer.renderToString(
          <RouterContext {...renderProps}/>
        )
      }
        // resolve the rendered component and the store (both strings)
        resolve({html: renderedComponent, store: JSON.stringify(store)});
      } else {
        reject({ type: ERROR_TYPES.NO_RENDER_PROPS });
      }
    });
  });
 
};