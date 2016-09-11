'use strict';

module.exports = {
  search: search
};

/**
 * Performs a binary search to find the peak of a unimodal array.
 *
 * @param {!Array<number>} array
 * @return {number} Index of peak.
 */
function search(array) {
  return searchHelper(array, 0, array.length - 1);
}

function searchHelper(array, lo, hi) {
  if ((hi - lo) <= 1) {
    return array[hi] > array[lo] ? hi : lo;
  }

  var mid = Math.floor((hi + lo) / 2);
  var isMidLargerThanL = array[mid] > array[mid - 1];
  var isMidLargerThanR = array[mid] > array[mid + 1];
  if (isMidLargerThanL && isMidLargerThanR) {
    return mid;
  }

  if (isMidLargerThanR) {
    return searchHelper(array, lo, mid - 1); // search left
  } else {
    return searchHelper(array, mid + 1, hi); // search right
  }
}
