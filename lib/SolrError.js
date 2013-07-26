'use strict';

function SolrError() {
    if ((this instanceof SolrError) === false) {
        return new SolrError();
    }

    var status;

    var queryTime;

    var params = {};

    var msg = '';

    var code = 0;

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


    this.setMessage = function (message) {
        msg = message;
    };

    this.getMessage = function () {
        return msg;
    };

    this.msg = this.getMessage;


    this.setCode = function (errorCode) {
        code = parseInt(errorCode, 10);
        return this;
    };

    this.getCode = function () {
        return parseInt(code, 10);
    };

    this.code = this.getCode;

    this.toString = function () {
        return msg;
    };
}

module.exports = SolrError;