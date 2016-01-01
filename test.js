'use strict';
var resolveDeepProps = require('./');
var Promise = require('bluebird');

var tape = require('tape');
tape('test description', function (test) {
    test.plan(5);
    var a = Promise.resolve([0, 1, Promise.resolve(2), Promise.resolve([3, Promise.resolve([4, 5])])]);
    var b = Promise.resolve({
        a: 0,
        b: 1,
        c: {
            d: Promise.resolve(2),
            e: Promise.resolve({
                f: 3,
                g: Promise.resolve({
                    h: 4,
                    i: Promise.resolve(5),
                    j: {
                        k: Promise.resolve(6),
                    },
                }),
            }),
        },
    });
    resolveDeepProps(a).then(JSON.stringify).then(a => test.strictEqual(a, '[0,1,2,[3,[4,5]]]'));
    resolveDeepProps(b).then(JSON.stringify).then(b => test.strictEqual(b, '{"a":0,"b":1,"c":{"d":2,"e":{"f":3,"g":{"h":4,"i":5,"j":{"k":6}}}}}'));
    resolveDeepProps(null).then(JSON.stringify).then(n => test.strictEqual(n, 'null'));
    resolveDeepProps(false).then(JSON.stringify).then(f => test.strictEqual(f, 'false'));
    resolveDeepProps('str').then(JSON.stringify).then(str => test.strictEqual(str, '"str"'));

})
