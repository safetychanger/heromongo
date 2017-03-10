'use strict';

const utils = require('./utils');

module.exports = function(app, collection, options) {
  app = utils.herokuApp(app);

  // csv is only supported when we do have fields
  const type = options.type || options.fields ? 'csv' : 'json';
  const timestamp = new Date().toISOString().replace(/:/g, '_');
  const path = process.env.DUMP_DIRECTORY || `/Users/${utils.exec('whoami')}/Sites`;
  const root = `${path}/dump/${app}`;
  const file = `${root}/${collection}_${timestamp}.${type}`;

  const connection = utils.connection(app);

  if (!connection) {
    return;
  }

  connection.push('--collection', collection);
  connection.push('--type', type);
  connection.push('--out', file);

  if (options.query) {
    connection.push('--query', options.query);
  }
  if (options.fields) {
    connection.push('--fields', options.fields);
  }

  console.info('Exporting database collection %s for %s to %s', collection, app, file,  '\n');
  console.info(['$', 'mongoexport', ...connection].join(' '), '\n\n');

  utils.exec(`mkdir -p ${root}`);
  utils.exec(`touch ${file}`);
  utils.spawn('mongoexport', connection);
};
