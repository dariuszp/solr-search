'use strict';

var tool = require('./tool'),
    util = require('util'),
    sys = require('sys'),
    events = require('events');

function Select(collection, path) {
    if (path === undefined) {
        path = '/select';
    } else {
        if (path.length > 0 && path[0] !== '/') {
            path = '/' + path;
        }
    }
    path = util.format('%s%s', config.client.name, path);

//    var url = tool.createSolrUrl(config.client, path, {
//        wt: wt
//    });

    events.EventEmitter.call(this);
}

sys.inherits(Select, events.EventEmitter);

module.exports = Select;
