'use strict';

function SolrResult() {
    if ((this instanceof SolrResult) === false) {
        return new SolrResult();
    }

    var status;

    var queryTime;

    var params = {};

    var numFound;

    var start = 0;

    var docs = [];

    var debug = {};

    this.setStatus = function (responseStatus) {
        status = parseInt(responseStatus, 10);
        return this;
    };

    this.getStatus = function () {
        return status;
    };

    this.status = this.getStatus;


    this.setQueryTime = function (qTime) {
        queryTime = parseInt(qTime, 10);
        return this;
    };

    this.getQueryTime = function () {
        return parseInt(queryTime, 10);
    };

    this.qTime = this.getQueryTime;


    this.setParams = function (queryParams) {
        params = queryParams;
        return this;
    };

    this.getParams = function () {
        return (params === undefined) ? {} : params;
    };

    this.params = this.getParams;


    this.setNumFound = function (numberFound) {
        numFound = parseInt(numberFound, 10);
        return this;
    };

    this.getNumFound = function () {
        return parseInt(numFound, 10);
    };

    this.numFound = this.getNumFound;


    this.setStart = function (startRow) {
        start = parseInt(startRow, 10);
        return this;
    };

    this.getStart = function () {
        return parseInt(start, 10);
    };

    this.start = this.getStart;


    this.setDocs = function (documents) {
        if ((documents instanceof Array) === false) {
            docs = [];
            return this;
        }
        docs = documents;
        return this;
    };

    this.getDocs = function () {
        return docs;
    };

    this.docs = this.getDocs;


    this.setDebug = function (debugResult) {
        if ((debugResult instanceof Object) === false) {
            return false;
        }
        debug = debugResult;

        return this;
    };

    this.getDebug = function () {
        return debug;
    };

    this.debug = this.getDebug;
}

module.exports = SolrResult;