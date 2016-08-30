'use strict';

module.exports = {
  search: search
};

/**
 * Performs a binary search.
 *
 * @param {!Array<number>} array
 * @param {number} value
 * @return {?number} Index of value if found, null otherwise.
 */
function search(array, value) {
  var n = array.length;
  var i = 0;
  var j = n - 1;
  while (i <= j) {
    var m = Math.floor((i + j) / 2);
    if (array[m] > value) {
      j = m - 1;
    } else if (array[m] < value) {
      i = m + 1;
    } else {
      return m;
    }
  }
  return null;
}
