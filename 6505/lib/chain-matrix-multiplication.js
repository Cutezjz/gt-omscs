'use strict';

module.exports = {
  cost: cost
};

var _ = require('lodash');

/**
 * Determines the minimum cost of multiplying a chain of matrices.
 *
 * @param {!Array<number>} matrices Matrix dimensions.
 * @return {number}
 */
function cost(matrices) {
  var n = matrices.length;
  var c = {};

  var i = 0;
  var j = 0;
  var k = 0;
  var s = 0;
  var q = 0;

  // BASE CASE
  for (i = 1; i < n; i++) {
    _.set(c, [i, i], q);
  }

  // RECURSIVE CASE
  for (s = 2; s < n; s++) {
    for (i = 1; i < n - s + 1; i++) {
      j = i + s - 1;
      _.set(c, [i, j], Number.MAX_SAFE_INTEGER);
      for (k = i; k < j; k++) {
        q = _.get(c, [i, k]) +
            _.get(c, [k+1, j]) +
            matrices[i-1] * matrices[k] * matrices[j];
        if (q < _.get(c, [i, j])) {
          _.set(c, [i, j], q);
        }
      }
    }
  }

  return _.get(c, [1, n-1]);
}
