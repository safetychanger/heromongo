'use strict';

const utils = require('./utils');

module.exports = function(app, script) {
  app = utils.herokuApp(app);

  let connection = utils.connection(app, 'simple');

  if (!connection) {
    return;
  }

  connection = connection.filter(arg => arg !== '-d');

  if (typeof script === 'string') {
    if (!script.endsWith('.js')) {
      connection.push('--eval');
    }

    connection.push(`"${script}"`);
  }

  connection = ['mongo', ...connection].join(' ');

  console.info('Connecting to database for %s', app, '\n');
  console.info('$', connection, '\n\n');

  require('child_process').execSync(connection, { stdio:[0,1,2] });
};
