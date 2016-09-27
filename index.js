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
  .command('export [app] [collection]')
  .option('-q, --query [value]', 'The query e.g. `{ name: "John Doe" }`')
  .option('-f, --fields [value]', 'Fields to be exported e.g. `name,address`')
  .option('-t, --type [value]', 'Export file type csv|json', /^(csv|json)$/i)
  .description('Export data for a specific Heroku app')
  .action(require('./lib/export'));

program
  .parse(process.argv);
