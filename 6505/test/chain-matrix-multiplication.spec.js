'use strict';

var _      = require('lodash');
var expect = require('chai').expect;
var cmm    = require('../lib/chain-matrix-multiplication');

describe('chain-matrix-multiplication', function () {
  it('calculates the minimum cost of multiplying matrices', function () {
    var tests = [
      { matrices: [6,3,1,3,8], expectedCost: 90 }
    ];

    _.forEach(tests, function (test) {
      var cost = cmm.cost(test.matrices);
      expect(cost).to.equal(test.expectedCost);
    });
  });
});
