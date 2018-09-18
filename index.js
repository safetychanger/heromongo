#!/usr/bin/env node

'use strict';

if (process.argv.length < 3) {
  process.argv.push('connect');
}

const program = require('commander');

program
  .command('dump [app]')
  .option('-e, --excludes [value]', 'The collections to exclude e.g. `users invoices`')
  .option('-c, --collections [value]', 'Collections to be exported e.g. `["users", { "collection": "invoices", query: "{ \"ts\": { \"$gt\": 0 } }" }]` or just `collection invoices`')
  .option('-q, --query [value]', 'Query to be used on all collections if no query is provided. `{ \"ts\": { \"$gt\": 0 } }`')
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
  .command('run [app] [script]')
  .description('Run script on database for a specific Heroku app')
  .action(require('./lib/connect'));

program
  .command('export [app] [collection]')
  .option('-q, --query [value]', 'The query e.g. `{ name: "John Doe" }`')
  .option('-f, --fields [value]', 'Fields to be exported e.g. `name,address`')
  .option('-t, --type [value]', 'Export file type csv|json', /^(csv|json)$/i)
  .description('Export data for a specific Heroku app')
  .action(require('./lib/export'));

program
  .command('redisflush [app]')
  .description('Flush redis store for a specific Heroku app')
  .action(require('./lib/redis'));

program
  .parse(process.argv);
