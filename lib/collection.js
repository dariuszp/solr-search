'use strict';

var request = require('./request'),
    util = require('util'),
    tool = require('./tool'),
    sys = require('sys'),
    events = require('events'),
    Select = require('./Select'),
    SolrDocument = require('./SolrDocument');

function convertType(val) {
    if (val instanceof Date) {
        return tool.escapeXML(val.toISOString());
    }

    switch (typeof val) {
    case 'function':
        val = val.toString();
        break;
    case 'object':
        val = val.toString();
        break;
    case 'array':
        val = val.toSTring();
        break;
    case 'undefined':
        val = '';
        break;
    case 'null':
        val = '';
        break;
    }

    return tool.escapeXML(val);
}

function getAtomic(option) {
    if (option === 'add') {
        return 'add';
    }
    if (option === 'inc') {
        return 'inc';
    }
    return 'set';
}

function Collection(config) {
    if ((this instanceof Collection) === false) {
        return new Collection(config);
    }

    var wt = 'json',
        fields = {},
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

    this.getName = function () {
        return config.client.name;
    };

    this.getClient = function () {
        return config.client;
    };

    this.getFields = function () {
        return fields;
    };

    this.select = function (path) {
        return new Select(self, path);
    };

    this.add = function (entities, callback, options) {
        if (typeof options !== 'object') {
            options = {};
        }

        if (options.quiet === undefined) {
            options.quiet = false;
        } else {
            options.quiet = options.quiet ? true : false;
        }

        if (options.commit === undefined) {
            options.commit = true;
        } else {
            options.commit = options.commit ? true : false;
        }

        if (options.waitFlush === undefined) {
            options.waitFlush = true;
        } else {
            options.waitFlush = options.waitFlush    ? true : false;
        }

        if (options.waitSearcher === undefined) {
            options.waitSearcher = true;
        } else {
            options.waitSearcher = options.waitSearcher    ? true : false;
        }

        if (options.softCommit === undefined) {
            options.softCommit = false;
        } else {
            options.softCommit = options.softCommit    ? true : false;
        }

        if (options.commitWithin === undefined) {
            options.commitWithin = false;
        } else {
            options.commitWithin = parseInt(options.commitWithin, 10) > 0 ? parseInt(options.commitWithin, 10) : false;
        }

        if (options.overwrite === undefined) {
            options.overwrite = true;
        } else {
            options.overwrite = options.overwrite ? true : false;
        }

        if (options.boost === undefined) {
            options.boost = false;
        } else {
            options.boost = parseFloat(options.boost);
        }

        if (options.atomic === undefined) {
            options.atomic = {};
        }

        if (!entities) {
            entities = [];
        }

        if ((entities instanceof Array) === false) {
            entities = [ entities ];
        }

        if (entities.length === 0) {
            return false;
        }

        var i,
            xml = '<add overwrite="%s">%s</add>',
            doc = '<doc%s>%s</doc>',
            row = '<field name="%s"%s>%s</field>';

        var document = {},
            field = '',
            result = '',
            docstr = '',
            rowstr;

        for (i = 0; i < entities.length; i++) {
            docstr = '';
            rowstr = '';
            document = entities[i];
            if ((document instanceof Object) === false) {
                throw new Error('Document must be a JSON object or SolrDocument type');
            }

            if (document instanceof SolrDocument) {
                document = document.getRawData();
            }

            for (field in document) {
                if (document.hasOwnProperty(field)) {
                    if (!options.quiet && fields[field] === undefined) {
                        throw new Error(util.format('Field "%s" not present in schema.xml', field));
                    }

                    rowstr += util.format(row, tool.escapeXML(field), options.atomic[field] ? util.format(' update=""%s', getAtomic(options.atomic[field])) : '', convertType(document[field]));
                }
            }
            docstr += util.format(doc, (options.boost !== false) ? util.format(' boost="%s"', options.boost) : '', rowstr);
            result += docstr;
        }

        field = '';
        docstr = '';
        rowstr = '';

        result = util.format(xml, options.overwrite ? 'true' : 'false', result);

        var postOpt = {
            commit: (options.commit) ? 'true' : 'false',
            waitFlush: (options.waitFlush) ? 'true' : 'false',
            waitSearcher: (options.waitSearcher) ? 'true' : 'false',
            softCommit: (options.softCommit) ? 'true' : 'false',
            wt: wt
        };
        if (options.commitWithin !== false) {
            postOpt.commitWithin = options.commitWithin;
        }

        request.post(tool.createSolrUrl(config.client, '/update', postOpt), result, function (data) {
            data = JSON.parse(data);

            self.emit('add', entities, data);
            if (typeof callback === 'function') {
                callback(entities, data);
            }
        });
    };


    /**
     *
     * @param mixed id document id
     * @param function callback after deletion
     * @param bool commit commit change ?
     */
    this.deleteById = function (id, callback, commit) {
        var escapedUniqueKey = tool.escapeXML(uniqueKey);
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
            'wt': wt
        }), util.format('<delete><%s>%s</%s></delete>', escapedUniqueKey, id, escapedUniqueKey), function (data) {
            data = JSON.parse(data);
            self.emit('delete', id, data);
            if (typeof callback === 'function') {
                callback(id, data);
            }
        });

        return this;
    };

    /**
     *
     * @param string query select query
     * @param function callback after deletion
     * @param bool commit commit change ?
     */
    this.deleteByQuery = function (query, callback, commit) {
        query = tool.escapeXML(query);
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
            'wt': wt
        }), util.format('<delete><query>%s</query></delete>', query), function (data) {
            data = JSON.parse(data);
            self.emit('delete', query, data);
            if (typeof callback === 'function') {
                callback(query, data);
            }
        });

        return this;
    };

    events.EventEmitter.call(this);
}

sys.inherits(Collection, events.EventEmitter);

module.exports = Collection;