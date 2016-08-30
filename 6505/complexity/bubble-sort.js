'use strict';

var _         = require('lodash');
var expect    = require('chai').expect;
var Benchmark = require('benchmark');
var constants = require('../constants');
var sorter    = require('../lib/bubble-sort');

describe('bubble-sort', function () {
  this.timeout(constants.Time.Minute);

  var tests;
  var suite;

  it('has worst-case time complexity of Θ(n^2)', function (done) {
    tests = [
      {name: 'n * 2^10', array: _.range(Math.pow(2, 10)).reverse()},
      {name: 'n * 2^11', array: _.range(Math.pow(2, 11)).reverse()},
      {name: 'n * 2^12', array: _.range(Math.pow(2, 12)).reverse()}
    ];

    suite = new Benchmark.Suite();

    _.forEach(tests, function (test) {
      suite.add(test.name, function () {
        sorter.sort(test.array);
      });
    });

    suite.on('complete', function () {
      var n10 = this[0].stats.mean;
      var n11 = this[1].stats.mean;
      var n12 = this[2].stats.mean;

      expect(n12).to.be.closeTo(n10 * Math.pow(2, 4), 0.001);
      expect(n12).to.be.closeTo(n11 * Math.pow(2, 2), 0.001);

      done();
    }).run({async: false, maxTime: constants.Time.Minute});
  });
});
