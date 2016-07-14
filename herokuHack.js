/*
  On heroku, a babel-loader dependency causes application build
  to fail and crash. Installing before webpack execution fixes this.

  Failure is due to the fact that on linux running npm install babel-loader
  causes the process return exit 1 due to the fact that fsevents is not
  compatible with linux. Even though it exists with an error, babel-loader
  is still installed.
 */
if (require('is-heroku')) {
  var exec = require('child_process').exec;
  var fs = require('fs');

  exec('npm install babel-loader', function(err) {
    if (err) {
      console.log('herokuHack: ', 'Error installing babel-loader');
      process.exit(1);
    }

    // check to see if babel-loader is installed
    try {
      fs.accessSync('./node_modules/babel-loader', fs.F_OK);
      console.log('herokuHack: ', 'babel-loader installed successfully');
    } catch (err) {
      console.log('herokuHack: ', 'Error installing babel-loader');
      process.exit(1);
    }
  });


}
