'use strict';

var util = require('util'),
    urlParser = require('url'),
    queryString = require('querystring');

module.exports = {
    createSolrUrl: function (client, path, params) {
        if (!client) {
            throw new Error('Client information are missing');
        }
        if (!path) {
            throw new Error('Path is missing');
        }
        if (client.path.length > 0 && client.path[0] !== '/') {
            client.path = '/' + client.path;
        }
        if (path.length > 0 && path[0] !== '/') {
            path = '/' + path;
        }
        if (typeof path !== 'string') {
            throw new Error('Collection name must be a string');
        }

        var solrUrl = util.format('%s://%s%s:%s%s', client.https ? 'https' : 'http', client.auth ? '?' + client.auth : '', client.host, client.port, util.format('%s%s', client.path, path)),
            param;

        solrUrl = urlParser.parse(solrUrl);
        if (solrUrl) {
            solrUrl.query = queryString.parse(solrUrl.query);
            if ((solrUrl.query instanceof Object) === false) {
                solrUrl.query = {};
            }
        }
        if (params instanceof Object) {
            for (param in params) {
                if (params.hasOwnProperty(param)) {
                    solrUrl.query[param] = queryString.escape(params[param]);
                }
            }
        }

        solrUrl.query = queryString.stringify(solrUrl.query);
        if (solrUrl.query && solrUrl.query.length > 0) {
            solrUrl.search = '?' + solrUrl.query;
            solrUrl.path = solrUrl.pathname + '?' + solrUrl.query;
        }

        solrUrl.href = util.format('%s://%s%s%s', client.https ? 'https' : 'http', solrUrl.auth || '', solrUrl.host, solrUrl.path);

        return solrUrl.href;
    }
}