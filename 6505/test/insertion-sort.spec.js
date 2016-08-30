'use strict';

var _      = require('lodash');
var expect = require('chai').expect;
var sorter = require('../lib/insertion-sort');

describe('insertion-sort', function () {
  it('sorts an array', function () {
    var tests = [
      [],
      [0],
      [1,0],
      [0,1],
      [0,1,2],
      [0,2,1],
      [1,0,2],
      [1,2,0],
      [2,0,1],
      [2,1,0],
      [1,2,3,4],
      [1,2,4,3],
      [1,3,2,4],
      [1,3,4,2],
      [1,4,3,2],
      [1,4,2,3],
      [2,1,3,4],
      [2,1,4,3],
      [2,3,1,4],
      [2,3,4,1],
      [2,4,1,3],
      [2,4,3,1],
      [5,4,3,2,1]
    ];

    _.forEach(tests, function (test) {
      var array = _.clone(test);
      sorter.sort(array);
      expect(array).to.eql(test.sort());
    });
  });
});
