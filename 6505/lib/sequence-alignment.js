'use strict';

module.exports = {
  cost: cost
};

var _ = require('lodash');

/**
 * Determines the minimum cost of aligning x with y.
 *
 * @param {string} x
 * @param {string} y
 * @param {number=} a Mismatch cost.
 * @param {number=} b No match cost.
 * @return {number}
 */
function cost(x, y, a, b) {
  x = x.toUpperCase().split('');
  y = y.toUpperCase().split('');
  a = a || 1.5;
  b = b || 1.0;

  var i = 0;
  var m = x.length;

  var j = 0;
  var n = y.length;

  var c = {};

  for (i = 0; i < m; i++) {
    _.set(c, [i, 0], i);
  }

  for (j = 0; j < n; j++) {
    _.set(c, [0, j], j);
  }

  var c1, c2, c3;

  for (i = 1; i < m; i++) {
    for (j = 1; j < n; j++) {
      // match x_i and y_j
      c1 = c[i-1][j-1] + (x[i] === y[j] ? 0 : a);

      // leave x_i unmatched
      c2 = c[i-1][j] + b;

      // leave y_i unmatched
      c3 = c[i][j-1] + b;

      // cost is minimum of three possibilities
      c[i][j] = min(c1, c2, c3);
    }
  }

  return c[m-1][n-1];
}

/**
 * Determines the minimum of three numbers.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number}
 * @private
 */
function min(a, b, c) {
  return Math.min(Math.min(a, b), c);
}
