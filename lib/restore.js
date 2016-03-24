'use strict';

const utils = require('./utils');

module.exports = function(app, dir, options) {
  app = utils.herokuApp(app);

  if (app === utils.herokuApp('production') && !options.iknowwhatiamdoing) {
    return console.error('You must provide the flag that you know what you are doing!');
  }

  const url = utils.exec(utils.format('heroku config:get MONGODB_URL -a %s', app));

  if (!/^mongodb:\/\/(.*?):(.*?)\@(.*)\/(.*?)(\?replicaSet=(.*?))?$/.test(url)) {
    return console.error('MONGODB_URL for app %s is not configured (correctly)', app);
  }

  const username = RegExp.$1;
  const password = RegExp.$2;
  const host = (RegExp.$6 ? RegExp.$6.concat('/') : '').concat(RegExp.$3);
  const database = RegExp.$4;

  const args = ['-h', host, '-d', database, '-u', username, '-p'.concat(password),
    'dump/'.concat(database)];

  console.info('Restoring database for %s from %s', app, dir);

  utils.spawn('mongorestore', args, dir);
};