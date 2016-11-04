'use strict';

const utils = require('./utils');

module.exports = function(app, script) {
  app = utils.herokuApp(app);

  let connection = utils.connection(app);

  if (!connection) {
    return;
  }

  connection = connection.filter(arg => arg !== '-d');
  connection.push(script);

  console.info('Executing script \'%s\' on database for %s', script, app, '\n');
  console.info(['$', 'mongo', ...connection].join(' '), '\n\n');

  utils.spawn('mongo', connection, connection);
};
