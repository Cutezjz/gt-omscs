'use strict';

var _        = require('lodash');
var expect   = require('chai').expect;
var searcher = require('../lib/binary-search');

describe('binary-search', function () {
  var tests;
  var index;

  it('returns null for an empty array', function () {
    tests = [
      {array: [], value: 1},
      {array: [], value: 2},
      {array: [], value: 3},
      {array: [], value: 12},
      {array: [], value: 123}
    ];

    _.forEach(tests, function (test) {
      index = searcher.search(test.array, test.value);
      expect(index).to.be.null;
    });
  });

  it('returns null if value is not in array', function () {
    tests = [
      {array: [1],                value: 2},
      {array: [2],                value: 3},
      {array: [1, 1],             value: 4},
      {array: [1, 2],             value: 5},
      {array: [1, 2, 3],          value: 6},
      {array: [1, 2, 3, 4],       value: 7},
      {array: [1, 2, 3, 4, 5],    value: 8},
      {array: [1, 2, 3, 4, 5, 6], value: 9}
    ];

    _.forEach(tests, function (test) {
      index = searcher.search(test.array, test.value);
      expect(index).to.be.null;
    });
  });

  it('returns index of value if value is in array', function () {
    tests = [
      {array: [1],                value: 1, expectedIndex: 0},
      {array: [2],                value: 2, expectedIndex: 0},
      {array: [1, 1],             value: 1, expectedIndex: 0},
      {array: [1, 2],             value: 2, expectedIndex: 1},
      {array: [1, 1, 1],          value: 1, expectedIndex: 1},
      {array: [1, 2, 3],          value: 1, expectedIndex: 0},
      {array: [1, 2, 3],          value: 2, expectedIndex: 1},
      {array: [1, 2, 3],          value: 3, expectedIndex: 2},
      {array: [1, 1, 1, 1],       value: 1, expectedIndex: 1},
      {array: [1, 2, 3, 4],       value: 1, expectedIndex: 0},
      {array: [1, 2, 3, 4],       value: 2, expectedIndex: 1},
      {array: [1, 2, 3, 4],       value: 3, expectedIndex: 2},
      {array: [1, 2, 3, 4],       value: 4, expectedIndex: 3},
      {array: [1, 1, 1, 1, 1],    value: 1, expectedIndex: 2},
      {array: [1, 2, 3, 4, 5],    value: 1, expectedIndex: 0},
      {array: [1, 2, 3, 4, 5],    value: 2, expectedIndex: 1},
      {array: [1, 2, 3, 4, 5],    value: 3, expectedIndex: 2},
      {array: [1, 2, 3, 4, 5],    value: 4, expectedIndex: 3},
      {array: [1, 2, 3, 4, 5],    value: 5, expectedIndex: 4},
      {array: [1, 1, 1, 1, 1, 1], value: 1, expectedIndex: 2},
      {array: [1, 2, 3, 4, 5, 6], value: 1, expectedIndex: 0},
      {array: [1, 2, 3, 4, 5, 6], value: 2, expectedIndex: 1},
      {array: [1, 2, 3, 4, 5, 6], value: 3, expectedIndex: 2},
      {array: [1, 2, 3, 4, 5, 6], value: 4, expectedIndex: 3},
      {array: [1, 2, 3, 4, 5, 6], value: 5, expectedIndex: 4},
      {array: [1, 2, 3, 4, 5, 6], value: 6, expectedIndex: 5}
    ];

    _.forEach(tests, function (test) {
      index = searcher.search(test.array, test.value);
      expect(index).to.equal(test.expectedIndex);
    });
  });
});
