'use strict';

const utils = require('./utils');

module.exports = function(app, options) {
  app = utils.herokuApp(app);

  const timestamp = new Date().toISOString();
  const dir = '/Users/'.concat(utils.exec('whoami'), '/Sites/dump/', app, '/', timestamp);

  let connection = utils.connection(app);

  if (!connection) {
    return;
  }

  connection.push('--excludeCollectionsWithPrefix=system');

  console.info('Dumping database for %s to %s', app, dir, '\n');
  console.info(['$', 'mongodump', ...connection].join(' '), '\n\n');

  utils.exec(utils.format('mkdir -p %s', dir));
  utils.exec(utils.format('ln -s %s %s', dir, dir.replace(timestamp, 'latest')));
  utils.spawn('mongodump', connection, dir);
};