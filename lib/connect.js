'use strict';

const utils = require('./utils');

module.exports = function(app, options) {
  app = utils.herokuApp(app);

  const url = utils.exec(utils.format('heroku config:get MONGODB_URL -a %s', app));

  if (!/^mongodb:\/\/(.*?):(.*?)\@(.*)\/(.*?)(\?replicaSet=(.*?))?$/.test(url)) {
    return console.error('MONGODB_URL for app %s is not configured (correctly)', app);
  }

  const username = RegExp.$1;
  const password = RegExp.$2;
  const host = (RegExp.$6 ? RegExp.$6.concat('/') : '').concat(RegExp.$3);
  const database = RegExp.$4;

  const args = ['--host', host, database, '-u', username, '-p'.concat(password)];

  console.info('Connecting to database for %s', app);

  console.log(['mongo', ...args].join(' '));
  require('child_process').execSync(['mongo', ...args].join(' '), { stdio:[0,1,2] });
};