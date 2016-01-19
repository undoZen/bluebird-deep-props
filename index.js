'use strict';

var map = require('lodash.map');
var mapValues = require('lodash.mapValues');
var Promise = require('bluebird');

function resolveArrayOrObject(obj) {
    return Promise.resolve(obj).then(function (resolved) {
        return Array.isArray(resolved) ? Promise.all(resolved) : Promise.props(resolved);
    });
}
function isPromise(obj) {
    return obj && obj.then && typeof obj.then === 'function';
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
