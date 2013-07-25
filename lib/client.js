'use strict';

var util = require('util'),
    sys = require('sys'),
    events = require('events'),
    request = require('./request'),
    tool = require('./tool'),
    Collection = require('./collection');

function Client(config) {
    if ((this instanceof Client) === false) {
        return new Client();
    }

    var self = this;

    var schemas = {};

    this.getCollection = function (name, callback) {
        var c;

        if (schemas[name] !== undefined) {
            c = new Collection({
                'name': name,
                'client': config,
                'schema': schemas[name]
            });
            self.emit('ready', c);
            if (typeof callback === 'function') {
                callback(c);
            }
            return;
        }

        var schemaUrl = tool.createSolrUrl(config, util.format('%s/schema', name));
        request.get(schemaUrl, function (data) {
            schemas[name] = JSON.parse(data);
            c = new Collection({
                'client': config,
                'schema': schemas[name]
            });
            self.emit('ready', c);
            if (typeof callback === 'function') {
                callback(c);
            }
        });
    };

    events.EventEmitter.call(this);
}

sys.inherits(Client, events.EventEmitter);

module.exports = Client;