'use strict';

function SolrResponse() {
    if ((this instanceof SolrResponse) === false) {
        return new SolrResponse();
    }

    var status;

    var queryTime;

    var params = {};

    var numFound;

    var start = 0;

    var docs = [];

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
}

module.exports = SolrResponse;