'use strict';

const utils = require('./utils');

module.exports = function(app, options) {
  app = utils.herokuApp(app);

  const timestamp = new Date().toISOString();
  let root = process.env.DUMP_DIRECTORY ||
    '/Users/'.concat(utils.exec('whoami'), '/Sites');
  root = root.concat('/dump/', app);
  const dir = root.concat('/', timestamp);
  const latest = root.concat('/latest');

  let connection = utils.connection(app);

  if (!connection) {
    return;
  }

  connection.push('--excludeCollectionsWithPrefix=system');

  console.info('Dumping database for %s to %s', app, dir, '\n');
  console.info(['$', 'mongodump', ...connection].join(' '), '\n\n');

  utils.exec(utils.format('mkdir -p %s', root));
  utils.exec(utils.format('mkdir -p %s', dir));
  utils.exec(utils.format('touch %s', latest));
  utils.exec(utils.format('rm %s', latest));
  utils.exec(utils.format('ln -s %s %s', dir, latest));
  utils.spawn('mongodump', connection, dir);
};