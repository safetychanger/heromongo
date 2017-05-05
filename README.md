heromongo
=========

Shortcuts to `mongo`, `mongodump` and `mongorestore` by reading MONGODB_URL from Heroku environment variables.

### Installation

```
$ npm install -g heromongo
$ sudo ln -s /usr/local/lib/node_modules/heromongo/index.js /usr/local/bin/heromongo
```

### Configuration

The only thing configurable right now is the app name mapping:
- `.heromongo.json` contains a few default app name entries, copy this file to `~` to prevent it from being updated by `npm update`.

### Usage

```
$ heromongo // connect to testing database
$ heromongo connect [staging] // connect to staging database
$ heromongo run [staging] scripts/nice.js // run script on staging database
$ heromongo dump [testing] // dump testing database
$ heromongo dump [testing] --excludes 'users invoices' --query '{\"ts\": { \"$gt\": 0 } }' --collections 'customers orders'"
// dump testing database but exclude users and invoices, and only get a subset of collections customers and orders
$ heromongo restore [staging] ~/Sites/dump/staging/2016-03-24_12-37-03 // restore staging database from this folder
$ heromongo export [testing] users -q '{ name: "John Doe" }' -f 'name,address' // export testing collection
```

See also: `$ heromongo --help`
