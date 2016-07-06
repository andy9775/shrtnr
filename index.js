// An Open source URL shortening service
//
// Copyright (c) 2016 by Andy Chrzaszcz.
// https://github.com/andy9775
// All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
  require('babel-core/register')();
  require('babel-polyfill');
  require('./src/server');
} else if (process.env.NODE_ENV == 'production') {
  require('./build/server');
} else {
  var expectedColor = require('chalk').green.bold;
  var actualColor = require('chalk').red.bold;
  console.error(
    'expected NODE_ENV to be ' +
    expectedColor('"production"') +
    ' or ' +
    expectedColor('"development".') +
    ' Got: ' +
    actualColor(process.env.NODE_ENV));
  process.exit(1);
}
