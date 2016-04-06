'use strict';

const utils = require('./utils');

module.exports = function(app, options) {
  app = utils.herokuApp(app);

  let connection = utils.connection(app);

  if (!connection) {
    return;
  }

  connection = connection.filter(arg => arg !== '-d');

  connection = ['mongo', ...connection].join(' ');

  console.info('Connecting to database for %s', app, '\n');
  console.info('$', connection, '\n\n');

  require('child_process').execSync(connection, { stdio:[0,1,2] });
};