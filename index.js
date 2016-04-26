/**
* Open source URL shortening service
*
* Coded by: Andy (github.com/andy9775)
*/
if (process.env.NODE_ENV == 'development') {
  require('babel-core/register')();
  require('babel-polyfill');
  require('./src/server');
} else if (process.env.NODE_ENV == 'production') {
  require('./build/server');
} else {
  var expectedColor = require('chalk').green.bold;
  var actualColor = require('chalk').red.bold;
  console.error(
    'expectedColor NODE_ENV to be ' +
    expectedColor('"production"') +
    ' or ' +
    expectedColor('"development".') +
    ' Got: ' +
    actualColor(process.env.NODE_ENV));
  process.exit(1);
}