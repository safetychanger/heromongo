'use strict';

const child = require('child_process');
const connectionRx = /^mongodb:\/\/(.*?):(.*?)\@(.*)\/(.*?)(\?(.*?))?$/;

module.exports = require('util');

let config = require('../.heromongo.json');
let APPS = config.APPS;

module.exports.exec = cmd => {
  let output = '';
  try {
    output = child.execSync(cmd).toString().replace(/[\r\n]+$/g, '');
  }
  catch (ex) {}

  return output;
};

module.exports.spawn = (cmd, args, cwd) => {
  const spawn = child.spawn(cmd, args, { cwd: cwd });
  spawn.stdout.pipe(process.stdout);
  spawn.stderr.pipe(process.stderr);
};

module.exports.dir = (app = 'testing') => {
  if (APPS[app]) {
    return APPS[app];
  }

  if (connectionRx.test(app)) {
    return RegExp.$4;
  }

  return app.replace(/[^A-Za-z0-9_-]+/g, '_');
}

module.exports.herokuApp = app => APPS[app] || app || APPS.testing;

module.exports.connection = (url, simple = false) => {
  if (!url.startsWith('mongodb://')) {
    url = module.exports.exec(`heroku config:get MONGODB_URL -a ${url}`);
  }

  if (!connectionRx.test(url)) {
    return console.error('MONGODB_URL for app %s is not configured (correctly)', app);
  }

  if (simple) {
    return [`"${url}"`];
  }

  const username = RegExp.$1;
  const password = RegExp.$2;
  const database = RegExp.$4;

  let query = RegExp.$6;
  let host = RegExp.$3;

  if (/replicaSet=(.*?)(&|$)/.test(query)) {
    host = `${RegExp.$1}/${host}`;
  }
  else {
    host = host.split(',')[0];
  }

  const args = ['--host', `"${host}"`, '-d', database, '-u', username, `-p${password}`];

  if (/authSource=(.*?)($|&)/.test(query)) {
    args.push('--authenticationDatabase', RegExp.$1);
  }
  if (/ssl=true/.test(query)) {
    args.push('--ssl');
  }
  if (/sslValidate=false/.test(query)) {
    args.push('--sslAllowInvalidCertificates');
  }

  return args;
};

try {
  config = require(`/Users/${module.exports.exec('whoami')}/.heromongo.json`);
}
catch (ex) {}

APPS = config && config.APPS || APPS;
