'use strict';

var request = require('./request'),
    util = require('util'),
    tool = require('./tool'),
    sys = require('sys'),
    events = require('events');

function Collection(config) {
    if ((this instanceof Collection) === false) {
        return new Collection(config);
    }

    var fields = {},
        uniqueKey = false,
        field,
        self = this;

    /**
     * Parse solr schema and extract available fields
     */
    if (config.schema && config.schema.schema && config.schema.schema.fields && config.schema.schema.fields instanceof Array) {
        for (field in config.schema.schema.fields) {
            if (config.schema.schema.fields.hasOwnProperty(field)) {
                fields[config.schema.schema.fields[field].name] = config.schema.schema.fields[field];
            }
        }
    }

    /**
     * Get unique key from solr schema
     * @type {*|boolean}
     */
    uniqueKey = config.schema.schema.uniqueKey || false;


    /**
     *
     * @param mixed id document id
     * @param function callback after deletion
     * @param bool commit commit change ?
     */
    this.deleteById = function (id, callback, commit) {
        id = tool.escapeXML(id);
        if (!uniqueKey) {
            self.emit('error', util.format('No unique key provided for %s', config.client.name));
        }
        if (commit || commit === undefined) {
            commit = true;
        } else {
            commit = false;
        }
        request.post(tool.createSolrUrl(config.client, '/update', {
            'commit': commit ? 'true' : 'false',
            'wt': 'json'
        }), util.format('<delete><%s>%s</%s></delete>', uniqueKey, id, uniqueKey), function (data) {
            data = JSON.parse(data);
            self.emit('delete', id, data);
            if (typeof callback === 'function') {
                callback(id, data);
            }
        });

        return this;
    };

    events.EventEmitter.call(this);
}

sys.inherits(Collection, events.EventEmitter);

module.exports = Collection;