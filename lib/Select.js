'use strict';

var tool = require('./tool'),
    util = require('util'),
    sys = require('sys'),
    events = require('events'),
    request = require('./request'),
    SolrResult = require('./SolrResult'),
    SolrError = require('./SolrError');

function Select(collection, path) {
    if (path === undefined) {
        path = '/select';
    } else {
        if (path.length > 0 && path[0] !== '/') {
            path = '/' + path;
        }
    }
    path = util.format('%s%s', collection.getClient().name, path);

    var wt = 'json',
        self = this;

    this.escape = tool.escapeLuceneSyntax;

    this.e = this.escape;

    /**
     * Query solr
     * @param query
     * @param options
     *  - function success
     *  - function error
     *  - function failure - alias to error
     *  - string filterQuery | fq
     *  - string sort
     *  - int limit | rows
     *  - int offset | start
     *  - array fieldList | fl
     *  - string defaultSearchField | df
     */
    this.query = function (query, options) {
        if ((options instanceof Object) === false) {
            options = {};
        }

        var data = [ util.format('q=%s', encodeURIComponent(query)) ],
            filterQuery = '',
            fieldList = [],
            schemaFieldList = collection.getFields(),
            limit = 0,
            offset = 0,
            sortData = [],
            i = 0,
            url = tool.createSolrUrl(collection.getClient(), path, { wt: wt });

        if (options.fq || options.filterQuery) {
            if (options.fq) {
                filterQuery = options.fq;
            } else {
                filterQuery = options.filterQuery;
            }
            data.push(util.format('fq=%s', encodeURIComponent(filterQuery)));
        }

        if (options.sort) {
            if (options.sort instanceof Object) {
                for (i in options.sort) {
                    if (options.sort.hasOwnProperty(i)) {
                        sortData.push(util.format('%s %s', i, (options.sort[i] === 'desc' || options.sort[i] === 'DESC' || options.sort[i] === false || options.sort[i] === -1) ? 'DESC' : 'ASC'));
                    }
                }
                data.push(util.format('sort=%s', encodeURIComponent(sortData.join(','))));
            } else {
                throw new Error('For sort provide object with format like this: { field: "ASC", field2: "DESC" }');
            }
        }

        if (options.rows || options.limit) {
            if (options.rows) {
                limit = parseInt(options.rows, 10);
            } else {
                limit = parseInt(options.limit, 10);
            }
            if (limit > 0) {
                data.push(util.format('rows=%s', limit));
            } else {
                throw new Error('Limit/rows must be a positive integer');
            }
        }

        if (options.start || options.offset) {
            if (options.start) {
                offset = parseInt(options.start, 10);
            } else {
                offset = parseInt(options.offset, 10);
            }
            if (offset > 0) {
                data.push(util.format('start=%s', offset));
            } else {
                throw new Error('Offset/start must be a positive integer');
            }
        }

        if (options.fl || options.fieldList) {
            if (options.fl) {
                fieldList = options.fl;
            } else {
                fieldList = options.fieldList;
            }
            if ((fieldList instanceof Array) === false) {
                throw new Error('Field list must be an Array');
            }
            for (i = 0; i < fieldList.length; i++) {
                if (schemaFieldList[fieldList[i]] === undefined) {
                    throw new Error(util.format('Field "%s" is not defined in schema.xml', fieldList[i]));
                }
            }
            data.push(util.format('fl=%s', encodeURIComponent(fieldList.join(','))));
        }

        request.post(url, data.join('&'), function (data) {
            data = JSON.parse(data);
            var se = new SolrResult(),
                serr,
                error = false;

            if (data instanceof Object) {
                if (data.status !== 0) {
                    error = true;
                }
                se.setStatus(data.status);
                se.setQueryTime(data.QTime);
                se.setParams(data.params);
                if (data.response) {
                    se.setNumFound(data.response.numFound);
                    se.setStart(data.response.start);
                    se.setDocs(data.response.docs);

                    self.emit('data', se);
                    if (typeof options.success === 'function') {
                        options.success(se);
                    }
                } else {
                    error = true;
                }
            } else {
                error = true;
            }
            if (error) {
                serr = new SolrError();
                serr.setStatus(data.status);
                serr.setQueryTime(data.QTime);
                serr.setParams(data.params);
                if (data.error && data.error.msg) {
                    serr.setMessage(data.error.msg);
                    if (data.error.code) {
                        serr.setCode(data.error.code);
                    }
                }
                self.emit('failure', serr);
                if (typeof options.error === 'function') {
                    options.error(serr);
                }
                if (typeof options.failure === 'function') {
                    options.failure(serr);
                }
            }
        }, true);
    };

    events.EventEmitter.call(this);
}

sys.inherits(Select, events.EventEmitter);

module.exports = Select;
