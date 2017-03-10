'use strict';

const utils = require('./utils');

module.exports = function(app, options) {
  app = utils.herokuApp(app);

  const timestamp = new Date().toISOString();
  const path = process.env.DUMP_DIRECTORY || `/Users/${utils.exec('whoami')}/Sites`;
  const bucket = utils.dir(app);
  const root = `${path}/dump/${bucket}`;
  const dir = `${root}/${timestamp}`;
  const latest = `${root}/latest`;

  const connection = utils.connection(app);

  if (!connection) {
    return;
  }

  connection.push('--excludeCollectionsWithPrefix=system');

  console.info('Dumping database for %s to %s', app, dir, '\n');
  console.info(['$', 'mongodump', ...connection, dir].join(' '), '\n\n');

  utils.exec(`mkdir -p ${root}`);
  utils.exec(`mkdir -p ${dir}`);
  utils.exec(`touch ${latest}`);
  utils.exec(`rm ${latest}`);
  utils.exec(`ln -s ${dir} ${latest}`);
  utils.spawn('mongodump', connection, dir);
};
