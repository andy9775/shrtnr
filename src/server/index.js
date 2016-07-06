/*
Main server configuration, setup and start
*/

import chalk from 'chalk';
import path from 'path';

// third party express middleware
import compression from 'compression';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import {logger} from '../lib/Logger';

import * as routes from './controllers/routes';

var app;
const PORT = process.env.PORT || 3000;
/* import the express app tailored to the environment
   e.g. development or production settings
*/
if (process.env.NODE_ENV == 'development'|| process.env.NODE_ENV == 'test') {
  app = require('./dev').default;
} else {
  app = require('./prod').default;
}

// setup middleware shared between dev and prod environment
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());

// setup handlebars middleware
app.engine('handlebars',
  expressHandlebars({
    layoutDir: 'src/server/templates',
    extname: 'handlebars'
  }));
app.set('view engine', '.handlebars');
app.set('views', path.resolve(__dirname, 'templates'));
app.enable('view cache');

// configure routes
app.use('/', routes.frontEnd);
app.use('/api/v1', routes.api.v1);

app.listen(PORT, (err) => {
  if (err) {
    logger.error(chalk.red.bold('ERROR ') + 'starting the app');
    logger.error(err.stack);
    process.exit(1);
  }

  logger.info(
    chalk.green.bold(
      process.env.NODE_ENV.toUpperCase()) +
    ' server started on port: ' +
    chalk.green.bold(PORT));
});
