'use strict';

const utils = require('./utils');

module.exports = function(app, collection, options) {
  app = utils.herokuApp(app);

  // csv is only supported when we do have fields
  const type = options.type || options.fields ? 'csv' : 'json';
  const timestamp = new Date().toISOString().replace(/:/g, '_');
  let root = process.env.DUMP_DIRECTORY ||
    '/Users/'.concat(utils.exec('whoami'), '/Sites');
  root = root.concat('/dump/', app);
  const file = root.concat('/', collection, '_', timestamp, '.', type);

  let connection = utils.connection(app);

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

  utils.exec(utils.format('mkdir -p %s', root));
  utils.exec(utils.format('touch %s', file));
  utils.spawn('mongoexport', connection);
};
