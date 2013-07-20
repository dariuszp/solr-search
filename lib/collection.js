'use strict';

function Collection(data) {
    if ((this instanceof Collection) === false) {
        return new Collection(data);
    }

    console.log(data.schema);
}

module.exports = Collection;