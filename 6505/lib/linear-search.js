'use strict';

module.exports = {
  search: search
};

/**
 * Performs a linear search.
 *
 * @param {!Array<number>} array
 * @param {number} value
 * @return {?number} Index of value if found, null otherwise.
 */
function search(array, value) {
  for (var i = 0, l = array.length; i < l; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return null;
}
