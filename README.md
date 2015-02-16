# OSM-Meta-util

A tool to download and process OSM Metadata. This data contains the most recent annotations around a commit to OSM. Specifically, `commit text`, `username`, `bounding box`, `creation date` and `number of edits`. The data is downloaded from the [planet](http://planet.osm.org/replication/changesets/) repository, which contains minutely changesets to OSM.

Once installed the tool can be used to pipe in compressed XML data between two dates and output it in JSON. OSM Meta Util can also be used in polling mode and continuously download the latest data every minute.  

## Installing

Clone the repo or download it as a zip. `npm` install the dependencies.

## Running

Require `osmMetaUtil.js` in your node app. 

```
var MetaUtil = require('./osmMetaUtil.js');
```

The `MetaUtil` constructor builds a Node Stream, so you can pipe it into stream transformers or into `process.stdout`

There are a few ways of using the utility:

### 1. Downloading between two dates

The files are named in numerical order since February 28th, 2012. They're incremented every minute. You need the file name related to the start and end date. For example, `001181708` refers to [http://planet.osm.org/replication/changesets/001/181/708.osm.gz](http://planet.osm.org/replication/changesets/001/181/708.osm.gz), created on `2015-02-10 20:56`.

```
var MetaUtil = require('./osmMetaUtil.js');
var through = require('through')
// Getting historical metadata, specify a start & end
var meta = MetaUtil({
     'delay': 1000,
     'start': 001181708, //2015-02-10 20:56
     'end': 001181721 //2015-02-10 21:09
 }).pipe(process.stdout)
```

### 2. Continuously 

```
// Live Mode! Updates every minute
var meta = MetaUtil().pipe(process.stdout)
```

### 3. Using as a command line utility

```
MetaUtil({
    'start': Number(process.argv[2]),
    'end': Number(process.argv[3]),
    'delay': Number(process.argv[4])
}).pipe(process.stdout)
```

```
node app 001181708 001181721 1000 | jq -c '{user:.user, date: .closed_at}'
```