/**
 * An opensource URL shortener
 *
 * Coded by: Andy (github.com/andy9775)
 */
// ============= VS code typings reference =============
/// <reference path="typings/main.d.ts" />
// =====================================================

import express from 'express';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../../webpack.config.dev.js';
import favicon from 'serve-favicon'; 
import WebpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';

var app = express();
var compiler = webpack(config);;
var devMiddleware = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
})
var hotMiddleware = webpackHotMiddleware(compiler);

app.use(devMiddleware);
app.use(hotMiddleware);
// express serves favicon in dev mode only
app.use(favicon('src/server/public/favicon.ico'));

const HMR_PORT = process.env.HMR_PORT || 8080;
new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(HMR_PORT, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }
  console.log(
    chalk.blue('...react hot module reload server') + 
    ' started on port: ' + 
    chalk.dim.yellow(HMR_PORT));
});

export default app;