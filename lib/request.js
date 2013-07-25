'use strict';

var http = require('http'),
    urlParser = require('url'),
    queryString = require('querystring');

function Request() {
    if ((this instanceof Request) === false) {
        return new Request();
    }

    this.post = function (url, data, callback, isForm) {
        url = urlParser.parse(url);
        var post = http.request({
            'auth': url.auth,
            'host': url.hostname,
            'port': url.port,
            'path': url.path,
            'method': 'POST',
            'headers': {
                'Content-Type': (isForm === true) ? 'application/x-www-form-urlencoded' : 'text/xml',
                'Content-Length': data.toString().length
            }
        }, function (res) {
            var data = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data = data + chunk;
            });
            res.on('end', function () {
                callback(data);
            });
        });

        post.write(data);
        post.end();

        return this;
    };

    this.get = function (url, callback) {
        url = urlParser.parse(url);
        var get = http.request({
            'auth': url.auth,
            'host': url.hostname,
            'port': url.port,
            'path': url.path,
            'method': 'GET'
        }, function (res) {
            var data = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data = data + chunk;
            });
            res.on('end', function () {
                callback(data);
            });
        });

        get.end();

        return this;
    };
}

module.exports = new Request();