'use strict';

var _         = require('lodash');
var expect    = require('chai').expect;
var Benchmark = require('benchmark');
var constants = require('../constants');
var searcher  = require('../lib/linear-search');

describe('linear-search', function () {
  var tests;
  var suite;

  it('has best-case time complexity of Θ(1)', function (done) {
    this.timeout(constants.Time.Minute);

    tests = [
      {name: 'n * 2^0', array: _.fill(Array(Math.pow(2, 0)), 1), value: 1},
      {name: 'n * 2^7', array: _.fill(Array(Math.pow(2, 7)), 1), value: 1},
      {name: 'n * 2^8', array: _.fill(Array(Math.pow(2, 8)), 1), value: 1},
      {name: 'n * 2^9', array: _.fill(Array(Math.pow(2, 9)), 1), value: 1}
    ];

    suite = new Benchmark.Suite();

    _.forEach(tests, function (test) {
      suite.add(test.name, function () {
        searcher.search(test.array, test.value);
      });
    });

    suite.on('complete', function () {
      var n0 = this[0].stats.mean;
      var n7 = this[1].stats.mean;
      var n8 = this[2].stats.mean;
      var n9 = this[3].stats.mean;

      expect(n0).to.be.closeTo(n7, 0.001);
      expect(n0).to.be.closeTo(n8, 0.001);
      expect(n0).to.be.closeTo(n9, 0.001);

      done();
    }).run({async: false, maxTime: constants.Time.Minute});
  });

  it('has worst-case time complexity of Θ(n)', function (done) {
    this.timeout(constants.Time.Minute);

    tests = [
      {name: 'n * 2^7', array: _.fill(Array(Math.pow(2, 7)), 1), value: 0},
      {name: 'n * 2^8', array: _.fill(Array(Math.pow(2, 8)), 1), value: 0},
      {name: 'n * 2^9', array: _.fill(Array(Math.pow(2, 9)), 1), value: 0}
    ];

    suite = new Benchmark.Suite();

    _.forEach(tests, function (test) {
      suite.add(test.name, function () {
        searcher.search(test.array, test.value);
      });
    });

    suite.on('complete', function () {
      var n7 = this[0].stats.mean;
      var n8 = this[1].stats.mean;
      var n9 = this[2].stats.mean;

      expect(n8).to.be.closeTo(n7 * 2, 0.001);
      expect(n9).to.be.closeTo(n7 * 4, 0.001);

      done();
    }).run({async: false, maxTime: constants.Time.Minute});
  });
});
