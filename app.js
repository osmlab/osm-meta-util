var MetaUtil = require('./osmMetaUtil.js');
var through = require('through')
// Getting historical metadata, specify a start & end
// var meta = MetaUtil({
//     'delay': 1000,
//     'start': 1181708,
//     'end': 1181721
// }).pipe(process.stdout)


// Live Mode! Updates every second
//var meta = MetaUtil().pipe(process.stdout)

// MetaUtil({
//     'start': Number(process.argv[2]),
//     'end': Number(process.argv[3]),
//     'delay': Number(process.argv[4])
// }).pipe(process.stdout)

MetaUtil({
    'delay': 1000,
    'start': 1181708,
    'end': 1181721
}).pipe(through(function(buf) {
    //operations on buffer
    this.queue(buf + 'blabla')
}))
.pipe(process.stdout)