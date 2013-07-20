'use strict';

var Client = require('./client'),
    util = require('util');

function Solr() {

    var config = {
        clients: []
    };

    /**
     * Add client
     * @param string name - endpoint name
     * @param string host - default 127.0.0.1
     * @param int port - default 8983
     * @param string path - default '/solr'
     * @param int timeout - default 5
     * @param string auth - default ""
     * @param bool https - default false (use https)
     */
    this.addClient = function (name, host, port, path, timeout, https, auth) {
        https = https ? true : false;
        name = name || 'collection1';

        timeout = parseInt(timeout, 10);
        if (timeout === 0) {
            timeout = 5;
        }

        config.clients[name] = {
            host: host || '127.0.0.1',
            port: parseInt(port, 10) || 8983,
            path: path || '/solr',
            timeout: timeout,
            auth: auth || '',
            https: https
        };
    };

    this.clearClients = function () {
        config.clients = [];
        return this;
    };

    this.getClient = function (name) {
        if ((typeof name === 'string') === false) {
            throw new Error('Name of client must be a string');
        }
        if (config.clients[name] === undefined) {
            throw new Error(util.format('Client "%s" is not registered', name.toString()));
        }
        return new Client(config.clients[name]);
    };
}

module.exports = new Solr();
