import Promise from 'bluebird';
import {routerMatch} from './Matcher';

/**
 * A helper function for matching react-router routes with the specified store
 * 
 * @param routes {Routes} - react-router routes configuration
 * @param location {String} - URL path of the request (req.url)
 * @param storePromise {Promise} - Promise for resolving the state store for 
 * the specified path
 * @returns {Promise} - A promise which returns the resolved component
 */
export default function render(routes, location, storePromise){
  return new Promise((resolve, reject) => {
    if (storePromise){
      storePromise()
        .then(store => {
          routerMatch(routes, location, store)
            .then((result) => resolve(result));
      });    
    } else {
      routerMatch(routes, location, undefined)
        .then(result => resolve(result));
    }
  });
}