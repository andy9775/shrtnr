/**
 * Open source URL shortening service
 *
 * Coded by: Andy (github.com/andy9775)
 */
// ============= VS code typings reference =============
/// <reference path="typings/main.d.ts" />
// =====================================================
/*
Main server configuration, setup and start
*/

import chalk from 'chalk';
import path from 'path';

// third party express middleware
import compression from 'compression';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';

import * as routes from './routes';

var app;
const PORT = process.env.PORT || 3000;
// import the express app
// TODO conditional imports in es2015
if (process.env.NODE_ENV == 'development') {
  app = require('./dev').default;
} else {
  app = require('./prod').default;
}
// setup middleware shared between dev and prod environment
app.use(helmet());
app.use(compression());

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
app.use('/', routes.HomePage);

app.listen(PORT, (err) => {
  if (err) {
    console.error(chalk.red.bold('ERROR ') + 'starting the app');
    console.log(err.stack);
    process.exit(1);
  }

  console.log(
    chalk.green.bold(
      process.env.NODE_ENV.toUpperCase()) +
    ' server started on port: ' +
    chalk.green.bold(PORT));
});


