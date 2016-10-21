'use strict';

var _      = require('lodash');
var expect = require('chai').expect;
var sa     = require('../lib/sequence-alignment');

describe('sequence-alignment', function () {
  it('calculates the minimum cost of aligning two strings', function () {
    var tests = [
      { x: 'S',     y: 'S',     a: 1.5, b: 1.0, expectedCost: 0   },
      { x: 'S',     y: 'SN',    a: 1.5, b: 1.0, expectedCost: 1.0 },
      { x: 'SU',    y: 'SN',    a: 1.5, b: 1.0, expectedCost: 1.5 },
      { x: 'SN',    y: 'SNO',   a: 1.5, b: 1.0, expectedCost: 1.0 },
      { x: 'SON',   y: 'SNO',   a: 1.5, b: 1.0, expectedCost: 2.0 },
      { x: 'SUNNY', y: 'SNOWY', a: 0.0, b: 0.0, expectedCost: 3.5 },
      { x: 'SUNNY', y: 'SNOWY', a: 1.5, b: 1.0, expectedCost: 3.5 }
    ];

    _.forEach(tests, function (test) {
      var cost = sa.cost(test.x, test.y, test.a, test.b);
      expect(cost).to.equal(test.expectedCost);
    });
  });
});
