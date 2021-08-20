define(function () {
    'use strict'

    /* Convert a single or array of resources into "URI1\nURI2\nURI3..." */
    return {
        read: function (str) {
            return str.split('\n')
        },
        write: function (obj) {
            if (obj instanceof Array) { // If this is an Array, extract the self URI and then join using a newline
                return obj.map(resource => resource._links.self.href).join('\n')
            } else { // otherwise, just return the self URI
                return obj._links.self.href;
            }
        }
    }
})