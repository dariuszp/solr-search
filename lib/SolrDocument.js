'use strict';

function SolrDocument(data) {

    var iso = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;

    if ((data instanceof Object) === false) {
        throw new Error('Invalid document data');
    }

    this.get = function (key, defaultValue) {
        if (data.hasOwnProperty(key) === false) {
            return defaultValue;
        }

        return iso.test(data[key]) ? (new Date(data[key])) : data[key];
    };

    this.set = function (key, value) {
        data.setProperty(key, value);
    };

    this.getRawData = function () {
        return data;
    };
}

module.exports = SolrDocument;