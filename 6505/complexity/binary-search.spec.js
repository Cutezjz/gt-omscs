'use strict';

var _         = require('lodash');
var expect    = require('chai').expect;
var Benchmark = require('benchmark');
var constants = require('../constants');
var searcher  = require('../lib/binary-search');

describe('binary-search', function () {
  this.timeout(constants.Time.Minute);

  var tests;
  var suite;

  it('has worst-case time complexity of Θ(log(n))', function (done) {
    tests = [
      {name: 'n * 2^6',  array: _.fill(Array(Math.pow(2,  6)), 1), value: 0},
      {name: 'n * 2^12', array: _.fill(Array(Math.pow(2, 12)), 1), value: 0},
      {name: 'n * 2^18', array: _.fill(Array(Math.pow(2, 18)), 1), value: 0}
    ];

    suite = new Benchmark.Suite();

    _.forEach(tests, function (test) {
      suite.add(test.name, function () {
        searcher.search(test.array, test.value);
      });
    });

    suite.on('complete', function () {
      var n6  = this[0].stats.mean;
      var n12 = this[1].stats.mean;
      var n18 = this[2].stats.mean;

      expect(n12).to.be.closeTo(n6 * 2, 0.001);
      expect(n18).to.be.closeTo(n6 * 3, 0.001);

      done();
    }).run({async: false, maxTime: constants.Time.Minute});
  });
});
