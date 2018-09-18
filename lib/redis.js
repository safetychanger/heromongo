'use strict';

const utils = require('./utils');

module.exports = function(app) {
  app = utils.herokuApp(app);

  const redis = utils.exec(`heroku config:get REDISCLOUD_URL -a ${app}`);
  if (!/^redis:\/\/rediscloud:(.*?)@(.*?):([0-9]+)$/.test(redis)) {
    return console.warn('No valid redis cloud URL provided for %s', app);
  }

  const auth = RegExp.$1;
  const host = RegExp.$2;
  const port = RegExp.$3;

  console.info('Flushing redis store for %s', app, '\n');
  console.info(utils.exec(`redis-cli -a ${auth} -h ${host} -p ${port} flushall`));
};
