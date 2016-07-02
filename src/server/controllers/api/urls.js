import Promise from 'bluebird';
import check from 'check-types';
import chalk from 'chalk';
import REGEX_URL from './regexUrl';
import {logger} from '../../../lib/Logger'
import config from '../../../../config';
import Hashids from 'hashids';
import {db, urlsSpec} from '../lib';
import url from 'url';

var longUrlSpec = urlsSpec.longUrl;
var ids = new Hashids(config.hashIdSalt, config.hashIdMinLength);


/**
 * Logic function which generates the short url for the post reuqest to
 * /api/v#/urls
 *
 * @param opt - options associated with the request
 * @param data - request body containing the long url
 * @returns - A promise
 */

export function generateShortUrl(opt, data) {
  check.assert(check.all([
    check.not.undefined(opt),
    check.not.undefined(data),
    check.map(
      data,
      { longUrl: check.string }
    )]),
    () => {
      logger.error(chalk.red.bold('Invalid arguments to generateShortUrl()'));
      reject(new Error(JSON.stringify({
        errorMessage: 'Invalid URL'
      })));
    });

  return new Promise((resolve, reject) => {
    if (!check.match(data.longUrl, REGEX_URL)) {
      logger.error('generateShortUrl:',
        'Incorrect URL posted: ' + data.longUrl);
      reject(new Error(JSON.stringify({
        errorMessage: 'Invalid URL'
      })));
    }
    // ensure URL is consistant 
    data.longUrl = url.parse(data.longUrl).href;

    if (data.hasOwnProperty('userName')) {
      generateUniqueUrl(resolve, reject, data);
    } else {
      generateUrl(resolve, reject, data);
    }
  });
}


/* ==================== private methods ==================== */
/**
 * Queries the Database and if an entry for the long url exists then returns    * the existing result. Else generates a unique short url. 
 * 
 * @param {function} resolve - callback function to resolve the promise
 * @param {function} reject - promise callback to reject the request
 * @param {object} data - request data
 */
function generateUrl(resolve, reject, data) {
  db(urlsSpec.tableName)
    .where({ long_url: data.longUrl, user_name: null }) // query
    .first('*') // first result
    .then(function (result) {
      if (result != null) { // global URL exists
        var shortUrl = url.resolve(config.domain,
          ids.encode(Number(result.id)));
        resolve({
          longUrl: data.longUrl,
          shortUrl: shortUrl
        });
      } else {// no entry exists for this URL
        generateUniqueUrl(resolve, reject, data); // generate a new one
      }
    });
}
/**
 * Creates and resolves a unique short url
 * 
 * @param {function} resolve - promise callback to reolve the request
 * @param {function} reject - promise callback to reject the request 
 * @param {object} data - request data
 */
function generateUniqueUrl(resolve, reject, data) {
  db
    .insert({
      long_url: data.longUrl,
      user_name: data.user_name ? data.user_name : null
    })
    .into(urlsSpec.tableName)
    .returning('id')
    .then(function (id) {
      if (id) {
        id = id[0];
        var shortUrl = url.resolve(config.domain, ids.encode(Number(id)));

        resolve({
          longUrl: data.longUrl,
          shortUrl: shortUrl
        });
      }
      else {
        reject(new Error(JSON.stringify({
          errorMessage: 'Cannot generate short URL'
        })));
        logger.error('generateUniqueUrl:', 'Cannot generate a new URL');
      }
    });
}