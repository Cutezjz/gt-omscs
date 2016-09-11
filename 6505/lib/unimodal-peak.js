'use strict';

module.exports = {
  find: find
};

/**
 * Finds the peak of an array.
 *
 * @param {!Array<number>} array
 * @return {number} Index of peak.
 */
function find(array) {
  return findHelper(array, 0, array.length - 1);
}

/**
 * Recursively finds the peak of an array.
 *
 * @param {!Array<number>} array
 * @param {number} lo Index to search from (inclusive).
 * @param {number} hi Index to search to (inclusive).
 * @return {number} Index of peak.
 * @private
 */
function findHelper(array, lo, hi) {
  if ((hi - lo) <= 0) {
    return hi;
  }

  var mid = Math.floor((hi + lo) / 2);
  var lPeak = findHelper(array, lo, mid);
  var rPeak = findHelper(array, mid + 1, hi);
  return larger(array, lPeak, rPeak);
}

/**
 * Selects from a pair the index of the larger element.
 *
 * @param {!Array<number>} array
 * @param {number} i
 * @param {number} j
 * @return {number} Index of the larger element (either i or j).
 * @private
 */
function larger(array, i, j) {
  return array[i] > array[j] ? i : j;
}
