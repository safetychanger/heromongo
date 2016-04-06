'use strict';

const utils = require('./utils');

module.exports = function(app, dir, options) {
  app = utils.herokuApp(app);

  if (app === utils.herokuApp('production') && !options.iknowwhatiamdoing) {
    return console.error('You must provide the flag that you know what you are doing!');
  }

  let connection = utils.connection(app);

  if (!connection) {
    return;
  }

  connection.push('--excludeCollectionsWithPrefix=system');

  let database = connection[connection.indexOf('-d') + 1];

  connection.push('dump/'.concat(database));

  console.info('Restoring database for %s from %s', app, dir, '\n');
  console.info(['$', 'mongorestore', ...connection].join(' '), '\n\n');

  utils.spawn('mongorestore', connection, dir);
};