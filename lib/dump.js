'use strict';

const utils = require('./utils');

module.exports = function(app, options) {
  app = utils.herokuApp(app);

  const timestamp = new Date().toISOString();
  const dir = '/Users/'.concat(utils.exec('whoami'), '/Sites/dump/', app, '/', timestamp);
  const url = utils.exec(utils.format('heroku config:get MONGODB_URL -a %s', app));

  if (!/^mongodb:\/\/(.*?):(.*?)\@(.*)\/(.*?)(\?replicaSet=(.*?))?$/.test(url)) {
    return console.error('MONGODB_URL for app %s is not configured (correctly)', app);
  }

  const username = RegExp.$1;
  const password = RegExp.$2;
  const host = (RegExp.$6 ? RegExp.$6.concat('/') : '').concat(RegExp.$3);
  const database = RegExp.$4;

  const args = ['-h', host, '-d', database, '-u', username, '-p'.concat(password),
    '--excludeCollectionsWithPrefix=system'];

  console.info('Dumping database for %s to %s', app, dir);

  utils.exec(utils.format('mkdir -p %s', dir));
  utils.spawn('mongodump', args, dir);
};