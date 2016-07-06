import _ from 'lodash';

/**
 * Wraps each request and strips relevent data from the req object
 * passing it into the api logic function
 *
 * @param apiMethod - function (Promise) which handles the api request
 * @returns - A promise
 */
export function routeWrapper(apiMethod) {
  /**
   * Function to handle the express route
   *
   * @param req - express request object
   * @param res - express response object
   * @param next - express middleware next in line
   */
  return function (req, res, next) {

    var data = req.body;
    let options = _.extend({}, req.query, req.params);
    
    return apiMethod(options, data)
      .then(json => {
        res.json(json || {});
      })
      .catch(err => res.status(500).json(err.message));
  }
}