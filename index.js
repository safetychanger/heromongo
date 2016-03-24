#!/usr/bin/env node

'use strict';

if (process.argv.length < 3) {
  process.argv.push('connect');
}

const program = require('commander');

program
  .command('dump [app]')
  .description('Dump database for a specific Heroku app')
  .action(require('./lib/dump'));

program
  .command('restore [app] [dir]')
  .option('--iknowwhatiamdoing', 'Necessary to restore a production database')
  .description('Restore database for a specific Heroku app')
  .action(require('./lib/restore'));

program
  .command('connect [app]')
  .description('Connect to database for a specific Heroku app')
  .action(require('./lib/connect'));

program
  .parse(process.argv);