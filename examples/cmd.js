var MetaUtil = require('../');

//Using as a command line utility
MetaUtil({
    'start': process.argv[2],
    'end': process.argv[3],
    'delay': process.argv[4]
}).pipe(process.stdout)

//Call with node cmd.js 001181708 001181721