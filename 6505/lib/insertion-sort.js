'use strict';

module.exports = {
  sort: sort
};

/**
 * Sorts an array using insertion sort.
 *
 * @param {!Array<number>} array
 */
function sort(array) {
  var n = array.length;
  for (var i = 0; i < n; i++) {
    var temp = array[i];
    var j = i - 1;
    while (j >= 0 && array[j] > temp) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = temp;
  }
}
