'use strict';

const utils = require('./utils');

module.exports = function(app, options) {
  function dump (conn) {
    console.info(['$', 'mongodump', ...conn, dir].join(' '), '\n\n');
    utils.spawn('mongodump', conn, dir);
  }

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

  utils.exec(`mkdir -p ${root}`);
  utils.exec(`mkdir -p ${dir}`);
  utils.exec(`touch ${latest}`);
  utils.exec(`rm ${latest}`);
  utils.exec(`ln -s ${dir} ${latest}`);

  console.info('Dumping database for %s to %s', app, dir, '\n');

  connection.push('--excludeCollectionsWithPrefix=system');

  if (options.excludes) {
    options.excludes.split(' ').forEach(e => {
      connection.push(`--excludeCollection=${e}`);
    });
  }

  if (options.collections) {
    const collections = options.collections.includes('[') ? JSON.parse(options.collections) : options.collections.split(' ');
    collections.forEach(e => {
      const collConnection = utils.connection(app);
      collConnection.push(`--collection=${e.collection||e}`);

      connection.push(`--excludeCollection=${e.collection||e}`);

      if (e.query || options.query) {
        collConnection.push(`--query=${e.query || options.query}`);
      }
      dump(collConnection);
    });
  }
  dump(connection);

};
