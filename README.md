# OSM-Meta-util

A tool to download and process OSM Metadata. This data contains the most recent annotations around a commit to OSM. Specifically, `commit text`, `username`, `bounding box`, `creation date` and `number of edits`. The data is downloaded from the [planet](http://planet.osm.org/replication/changesets/) repository, which contains minutely changesets to OSM.

Once installed the tool can be used to pipe in compressed XML data between two dates and output it in JSON. OSM Meta Util can also be used in polling mode and continuously download the latest data every minute.

A joint project built by [Development Seed](https://github.com/developmentseed) and the [American Red Cross](https://github.com/americanredcross).

## Installing

Clone the repo or download it as a zip. `npm install` the dependencies.

## Running

Require `osm-meta-util` in your node app.

```javascript
var MetaUtil = require('osm-meta-util');
```

The `MetaUtil` constructor builds a Node Stream, so you can pipe it into stream transformers or into `process.stdout`

There are a few ways of using the utility:

### 1. Downloading between two dates

The files are named in numerical order since February 28th, 2012. They're incremented every minute. You need the file name related to the start and end date. For example, `001181708` refers to [http://planet.osm.org/replication/changesets/001/181/708.osm.gz](http://planet.osm.org/replication/changesets/001/181/708.osm.gz), created on `2015-02-10 20:56`.

```javascript
var MetaUtil = require('osm-meta-util');
// Getting historical metadata, specify a start & end
var meta = MetaUtil({
     'delay': 1000,
     'start': '001181708', //2015-02-10 20:56
     'end': '001181721' //2015-02-10 21:09
 }).pipe(process.stdout)
```

### 2. Continuously

```javascript
// Live Mode! Updates every minute
var meta = MetaUtil().pipe(process.stdout)
```

### 3. Using as a command line utility

```javascript
MetaUtil({
    'start': process.argv[2],
    'end': process.argv[3],
    'delay': process.argv[4]
}).pipe(process.stdout)
```

Use it in combination with [jq](https://stedolan.github.io/jq/)

```sh
node app 001181708 001181721 1000 | jq -c '{user:.user, date: .closed_at}'
```
