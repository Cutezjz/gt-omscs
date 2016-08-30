'use strict';

module.exports = {
  sort: sort
};

/**
 * Sorts an array using selection sort.
 *
 * @param {!Array<number>} array
 */
function sort(array) {
  var n = array.length;
  var i = 0;
  while (i < (n - 1)) {
    var j = minimum(array, i, n);
    swap(array, i, j);
    i++;
  }
}

/**
 * Finds (earliest) minimum element in array[i...j-1].
 *
 * @param {!Array<number>} array
 * @param {number} i
 * @param {number} j
 * @return {number} Index of minimum element.
 */
function minimum(array, i, j) {
  var k = i;
  while (i < j) {
    if (array[i] < array[k]) {
      k = i;
    }
    i++;
  }
  return k;
}

/**
 * Swaps a pair of elements in an array.
 *
 * @param {!Array<number>} array
 * @param {number} i
 * @param {number} j
 */
function swap(array, i, j) {
  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}
