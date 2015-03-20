var zlib = require('zlib');
var request = require('request');
var fs = require('fs');
var expat = require('node-expat');
var Readable = require('stream').Readable;
var util = require('util');

util.inherits(MetaUtil, Readable)

function MetaUtil(opts) {
    if (!(this instanceof MetaUtil)) return new MetaUtil(opts);
    
    opts = opts || {}
    Readable.call(this, opts)
    
    var that = this;
    this.liveMode = (!opts.start && !opts.end && !opts.delay)
    this.state = Number(opts.start) || 0;
    this.end = Number(opts.end) || 1;
    this.diff = this.end - this.state;
    this.delay = (opts.delay || 60000)
    this.initialized = true;


    this.baseURL = opts.baseURL || 'http://planet.osm.org/replication/changesets'
    this._changesetAttrs = {}
    this.started = false;
    //start

}

MetaUtil.prototype._read = function() {
    var that = this;
    if (!this.started) {
        if (this.liveMode) {
            request.get('http://planet.osm.org/replication/changesets/state.yaml', 
            function(err, response, body) {
                that.state = Number(body.substr(body.length - 8))
                that.end = Infinity //don't stop
                that.delay = 60000 //every minute
                that.run()
                that.started = true;
            }
        )
        } else {
            this.run() 
            this.started = true  
        }
    }
}

MetaUtil.prototype.run = function() {
    var that = this;
    var numProcessed = 0;
    var parserEnd = function(name, attrs) {
        if (name === 'changeset') {
            that.push(new Buffer(JSON.stringify(that._changesetAttrs) + '\n'), 'ascii');
        }
        if (name === 'osm') {
            that.diff -= 1;
            if (!that.liveMode && that.diff < 0) {
                that.push(null)
            }
        }
    }

    var parserStart = function(name, attrs) {
        if (name === 'changeset') { 
            if (attrs) {
                that._changesetAttrs = attrs;
            }
        }
        if (name === 'tag' && that._changesetAttrs && that._changesetAttrs['open'] === 'false') { 
            that._changesetAttrs[attrs['k']] = attrs['v'];
        }
    }

    var interval = setInterval(function()  {

        //Add padding
        var stateStr = that.state.toString().split('').reverse()
        var diff = 9 - stateStr.length
        for (var i=0; i < diff; i++) { stateStr.push('0') }
        stateStr = stateStr.join('');

        //Create URL
        var url = '';
        for (var i=0; i<(stateStr.length/3); i++) {
            url += stateStr[i*3] + stateStr[i*3 + 1] + stateStr[i*3 + 2] + '/'
        }
    
        //XML Parser
        var xmlParser = new expat.Parser('UTF-8');
        xmlParser.on('startElement', parserStart)
        xmlParser.on('endElement', parserEnd)

        request.get(that.baseURL + url.split('').reverse().join('') + '.osm.gz')
            .pipe(zlib.createUnzip())
            .pipe(xmlParser)

        that.state += 1;
        if (that.state > that.end) {
            clearInterval(interval);
        }
    }, that.delay);    
}

module.exports = MetaUtil