'use strict';

const child = require('child_process');

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

module.exports.herokuApp = app => APPS[app] || app || APPS.testing;

module.exports.connection = app => {
  const url = app.includes('mongodb://') ? app : module.exports.exec(module.exports.format('heroku config:get MONGODB_URL -a %s', app));

  if (!/^mongodb:\/\/(.*?):(.*?)\@(.*)\/(.*?)(\?(.*?))?$/.test(url)) {
    return console.error('MONGODB_URL for app %s is not configured (correctly)', app);
  }

  const username = RegExp.$1;
  const password = RegExp.$2;
  const database = RegExp.$4;

  let query = RegExp.$6;
  let host = RegExp.$3;

  if (/replicaSet=(.*?)(&|$)/.test(query)) {
    host = RegExp.$1.concat('/', host);
  }
  else {
    host = host.split(',')[0];
  }

  const args = ['--host', host, '-d', database, '-u', username, '-p'.concat(password)];

  if (/ssl=true/.test(query)) {
    args.push('--ssl');
  }
  if (/sslValidate=false/.test(query)) {
    args.push('--sslAllowInvalidCertificates');
  }

  return args;
};

try {
  config = require('/Users/'.concat(module.exports.exec('whoami'), '/.heromongo.json'));
}
catch (ex) {}

APPS = config && config.APPS || APPS;
