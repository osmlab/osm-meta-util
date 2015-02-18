var MetaUtil = require('../');

var meta = MetaUtil({
    'delay': 1000,
    'start': '000598424', //file number
    'end': '001122000' //file number
}).pipe(process.stdout) //outputs to console