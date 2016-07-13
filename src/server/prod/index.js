/**
 * Production specific server configuration
 */

import express from 'express';
import config from '../../../config';
import {logger} from '../../lib/Logger';

var app = new express();

// have express serve static assets e.g. bundle.js or favicon
if (process.env.SERVE_STATIC || config.serve_static) {
  app.use(express.static('public'));
}

!(process.env.SERVE_STATIC || config.serve_static) &&
logger.info('Production server - ', 'Express is not serving static pages');

export default app;
