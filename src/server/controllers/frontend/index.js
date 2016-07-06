
import _ from 'lodash';
import {resolveShortUrl} from './ResolveShortUrl';
import config from '../../../../config';
import routes from '../../../shared/routes'
import render from '../../lib/render';

/**
 * Route function to handle resolving a short url.
 *
 * Responds to '/*'
 *
 * @export
 * @param {any} req
 * @param {any} res
 */
export function handleUrlResolution(req, res) {
  var data = req.body;
  let options = _.extend({}, req.query, req.params);
  resolveShortUrl(options, data)
    .then((resp) => {
      res.redirect(config.redirectCode, resp.longUrl);
    })
    .catch(err => res.redirect(config.errorRedirectCode, config.errorRedirectUrl));
}
/**
 * Route function to handle returning the homepage
 *
 * responds to '/'
 *
 * @export
 * @param {any} req
 * @param {any} res
 */
export function handleHomePage(req, res) {
  render(routes, req.url)
    .then(resp => {
      res.render('index', { body: resp.html, title: config.title });
    })
    .catch(() => res.status(500).send('Error rendering page'));
}
