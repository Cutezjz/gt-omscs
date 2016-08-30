'use strict';

module.exports = {
  sort: sort
};

/**
 * Sorts an array using bubble sort.
 *
 * @param {!Array<number>} array
 */
function sort(array) {
  var n = array.length;
  for (var i = 0; i < (n - 1); i++) {
    for (var j = n - 1; j > i; j--) {
      if (array[j] < array[j - 1]) {
        swap(array, j, j - 1);
      }
    }
  }
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
