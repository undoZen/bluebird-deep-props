'use strict';

var map = require('lodash.map');
var mapValues = require('lodash.mapvalues');
var Promise = require('bluebird');

function resolveArrayOrObject(obj) {
    return Promise.resolve(obj).then(function (resolved) {
        return Array.isArray(resolved) ? Promise.all(resolved) : Promise.props(resolved);
    });
}
function isPrimitive(val) {
    return val == null || val === true || val === false ||
        typeof val === "string" || typeof val === "number";
}

function resolveDeepProps(obj) {
    if (isPrimitive(obj)) {
        return Promise.resolve(obj);
    }
    return resolveArrayOrObject(obj)
        .then(function (resolved) {
            var mapfun = Array.isArray(resolved) ? map : mapValues;
            return resolveArrayOrObject(mapfun(resolved, resolveDeepProps));
        });
}

module.exports = resolveDeepProps;
