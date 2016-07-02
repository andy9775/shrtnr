import Promise from 'bluebird';
import chalk from 'chalk';
import check from 'check-types';
import {logger} from '../../../lib/Logger';
import config from '../../../../config';
import Hashids from 'hashids';
import {db, urlsSpec} from '../lib';

var ids = new Hashids(config.hashIdSalt, config.hashIdMinLength);

/**
 * Decode the short Url hash then fetch the long url from the database 
 * 
 * @export
 * @param {any} opt
 * @param {any} data
 * @returns
 */
export function resolveShortUrl(opt, data) {
  check.assert(check.all([
    check.not.undefined(opt),
    check.not.undefined(data)]),
    () => {
      logger.error(chalk.red.bold('Invalid arguments to resolveShortUrl()'));
      reject(new Error(JSON.stringify({
        errorMessage: 'An error occurred resolving the URL'
      })));
    });

  return new Promise((resolve, reject) => {
    var path = opt[0]; // short url path (hash)
    var id = ids.decode(path)[0];

    if (isNaN(id)) { // check if decode was valid
      reject();
      return;
    }

    db(urlsSpec.tableName)
      .where({ id: Number(id) })
      .first("long_url")
      .then((longUrl) => {
        if (longUrl) {
          resolve({ longUrl: longUrl.long_url });
        } else {
          reject(new Error());
          return;
        }
      });
  });
}