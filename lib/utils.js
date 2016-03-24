'use strict';

const child = require('child_process');
const config = require('../config.json');
const APPS = config && config.APPS || {};

module.exports = require('util');

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
