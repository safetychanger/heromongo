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
`/usr/local/lib/node_modules/heromongo/config.json` contains a few default app-name entries.
Modify these to get your own short cuts.

### Usage

```
$ heromongo // connect to testing database
$ heromongo connect [staging] // connect to staging database
$ heromongo dump [testing] // dump testing database
$ heromongo restore [staging] ~/Sites/dump/staging/2016-03-24_12-37-03 // restore staging database from this folder
```

See also: `$ heromongo --help`
