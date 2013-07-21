'use strict';

/*
var request = require('./lib/request'),
    colog = require('colog');

var simpleSelect = 'http://localhost:8983/solr/dariuszp/select?&q=*:*&wt=json&indent=true';
var update = 'http://localhost:8983/solr/update?commit=true&wt=json';

request.post(update, '<add><doc><field name="id">1</field><field name="title">Hello</field></doc><doc><field name="id">2</field><field name="title">world</field></doc></add>', function (data) {
    colog.dump(data, ['green', 'bold']);
});

request.get(simpleSelect, function (data) {
    colog.dump(JSON.parse(data), ['red', 'bgWhite', 'bold']);
});*/

var solr = require('./lib/solr'),
    colog = require('colog');

solr.addClient('dariuszp');

var dc = solr.getClient('dariuszp');

dc.on('ready', function (collection) {
//    collection.add([
//        { id: 1, title: 'Hello' },
//        { id: 2, title: 'Big' },
//        { id: 3, title: 'World' }
//    ], function (entities, data) {
//        colog.dump(data, ['green']);
//    });

//    collection.deleteByQuery('*:*');

//    collection.deleteById(2);
});

dc.getCollection('dariuszp');