'use strict';

/******************************************************************************
 * EXTERNAL DEPENDENCIES
 ******************************************************************************/

var _ = require('lodash');
var q = require('q');
var fs = require('fs');
var path = require('path');

/******************************************************************************
 * GLOBALS
 ******************************************************************************/

var parsedCommand = {};

/******************************************************************************
 * MAIN SCRIPT
 ******************************************************************************/

parseCommand()
.then(function () {
    var dir = './examples/' + parsedCommand.target;
    return q.all([
        readFile(dir + '/results/' + parsedCommand.analysis + '.txt'),
        readFile(dir + '/chord_output/log.txt')
    ]);
})
.then(function (files) {
    return findDiscrepancies({
        reference: files[0],
        actual: files[1]
    });
})
.then(function (discrepancies) {
    printDiscrepancies(discrepancies);
})
.catch(function (error) {
    console.error(error);
})
.finally(process.exit);

/******************************************************************************
 * UTILITIY
 ******************************************************************************/

Array.prototype.clean = function (deleteValue) {
    deleteValue = deleteValue || '';
    for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
    }
    return this;
};

function isNullOrEmpty(v) {
    return _.isNull(v) || _.isEmpty(v);
}

/******************************************************************************
 * PARSE COMMAND LINE ARGUMENTS
 ******************************************************************************/

/**
 * @description Parse the command line arguments.
 * @returns {Object} Prased arguments if successful, null otherwise.
 */
function parseCommand() {
    return new q.Promise(function (resolve, reject) {
        var args = _.map(process.argv || [], _.method('toLowerCase'));

        function getFlag(args, possibleFlags) {
            return _.intersection(args, possibleFlags)[0] || null;
        }

        parsedCommand = {
            target:   getFlag(args, ['array_demo', 'complex_test', 'fibo_test', 'greatest_test']),
            analysis: getFlag(args, ['reachdef', 'liveness'])
        };

        if (!_.isEmpty(_.pickBy(parsedCommand, _.isNull))) {
            return reject(usage());
        } else {
            return resolve(parsedCommand);
        }
    });
}

/**
 * @description Get the usage string.
 * @returns {String}
 */
function usage() {
    return [
        'Usage:',
        '  node index.js [target] [analysis]',
        '',
        'Options:',
        '  target:   array_demo, complex_test, fibo_test, greatest_test',
        '  analysis: liveness, reachdef'
    ].join('\n');
}

/******************************************************************************
 * READ FILE
 ******************************************************************************/

/**
 * @description Read and parse a file for discrepancy analysis.
 * @param {String} file File name.
 * @returns {Object} Parsed contents if successful.
 * @throws {Error} If there is a problem with reading or parsing the file.
 */
function readFile(file) {
    return new q.Promise(function (resolve, reject) {
        fs.readFile(file, 'utf8', function (error, data) {
            if (error) {
                return reject('error reading ' + file);
            }

            try {
                return resolve(parseFile(data.split('\n')));
            } catch (error) {
                return reject(path.basename(file) + ' ' + error.message);
            }
        });
    });
}

/**
 * @description Parse a file containing analysis results.
 * @param {Array} lines File lines.
 * @returns {Object} Map of quad IN/OUT sets keyed by quad ID.
 */
function parseFile(lines) {
    var start = lines.indexOf('********** ENTER Analysis Results **********');
    if (start === -1) {
        throw new Error('does not contain analysis results');
    }

    var end = lines.indexOf('********** LEAVE Analysis Results **********');
    if (end === -1) {
        throw new Error('contains incomplete analysis results');
    } else if (end <= start) {
        throw new Error('contains invalid analysis results');
    } else if ((end - start - 1) % 3 !== 0) {
        throw new Error('contains invalid analysis results');
    }

    var results = {};

    _.forEach(lines, function (line, index) {
        if (index >= end) {
            return false;
        } else if (index <= start) {
            // skip until in range
        } else if ((index - start - 1) % 3 === 0) {
            var quadId = parseFromLineQuadId(lines[index + 0]);
            if (_.isNull(quadId)) {
                throw new Error('contains invalid quad at line ' + (index + 0));
            }

            var inSet = parseFromLineSet(lines[index + 1]);
            if (_.isNull(inSet)) {
                throw new Error('contains invalid set of paris at line ' + (index + 1));
            }

            var outSet = parseFromLineSet(lines[index + 2]);
            if (_.isNull(outSet)) {
                throw new Error('contains invalid set of paris at line ' + (index + 2));
            }

            results[quadId] = {
                inSet: inSet,
                outSet: outSet
            };
        }
    });

    return results;
}

/**
 * @description Parse a quad ID from a line of analysis results.
 * @param {String} line
 * @returns {String} Quad ID in form Q{ID}, where ID is padded to 2 characters.
 */
function parseFromLineQuadId(line) {
    var match = line.match(/\[[0-9]+:/);
    if (match === null) {
        return null;
    } else {
        return 'Q' + _.padStart(match[0].substring(1, match[0].length - 1), 2, '0');
    }
}

/**
 * @description Parse a set of pairs from a line of analysis results.
 * @param {String} line
 * @returns {Array} List of pairs, each flanked by '<' and '>'.
 */
function parseFromLineSet(line) {
    if (!_.startsWith('\tIN :') && _.startsWith('\tOUT:')) {
        return null;
    }

    var set = line.substring(5);
    if (_.isEmpty(set)) {
        return [];
    }

    // help the user out in case running the incorrect check given the log.txt
    switch (parsedCommand.analysis) {
        case 'liveness':
            if (line.indexOf('>') !== -1) {
                throw new Error('seems to contain reachdef output');
            }
            break;
        case 'reachdef':
            if (line.indexOf('>') === -1) {
                throw new Error('seems to contain liveness output');
            }
            break;
    }

    if (parsedCommand.analysis === 'liveness') {
        return set.split(/\ +/g);
    } else {
        return _.map(set.split(/>\ +</g), function (pair) {
            pair = _.trim(pair);

            if (_.head(pair) !== '<') {
                pair = '<' + pair;
            }

            if (_.last(pair) !== '>') {
                pair = pair + '>';
            }

            return pair;
        });
    }
}

/******************************************************************************
 * COMPARE FILES
 ******************************************************************************/

/**
 * @description Compare two files to identify any discrepancies.
 * @param {Object} files Object containin `reference` and `actual` files.
 * @returns {Object} Discrepancies found.
 */
function findDiscrepancies(files) {
    return new q.Promise(function (resolve, reject) {
        var temp;

        var reference = files.reference;
        var referenceQuadIds = _.keys(reference);

        var actual = files.actual;
        var actualQuadIds = _.keys(actual);

        var discrepancies = {
            missing  : null,    // quads in reference but not in actual
            extra    : null,    // quads in actual but not in reference
            incorrect: null     // quads with incorrect IN/OUT sets
        };

        discrepancies.missing   = _.pullAll(_.clone(referenceQuadIds), actualQuadIds).clean();
        discrepancies.extra     = _.pullAll(_.clone(actualQuadIds), referenceQuadIds).clean();
        discrepancies.incorrect = _.omitBy(_.mapValues(reference, function (referenceQuad, quadId) {
            // only check intersection as `missing` and `extra` handle rest
            if (actualQuadIds.indexOf(quadId) === -1) {
                return null;
            }

            var actualQuad = actual[quadId];

            return _.omitBy(_.mapValues(referenceQuad, function (referenceSet, setKind) {
                return _.omitBy({
                    missing: _.pullAll(_.clone(referenceSet), actualQuad[setKind]).clean(),
                    extra  : _.pullAll(_.clone(actualQuad[setKind]), referenceSet).clean()
                }, isNullOrEmpty);
            }), isNullOrEmpty);
        }), isNullOrEmpty);

        return resolve(discrepancies);
    });
}

/******************************************************************************
 * OUTPUT
 ******************************************************************************/

/**
 * @description Print a set of values.
 * @param {Array} set
 * @param {String} indent Defaults to ''.
 * @param {String} delimiter Defaults to ', '.
 */
function printSet(set, indent, delimiter) {
    console.log((indent || '') + set.sort().join(delimiter || ', '));
}

/**
 * @description Print discrepancies.
 * @param {Object} discrepancies
 */
function printDiscrepancies(discrepancies) {
    if (_.isEmpty(_.omitBy(discrepancies, _.isEmpty))) {
        return console.log('Output matches expected.');
    }

    console.log('Discrepancies found.');

    var quadHeaders = {
        missing  : 'Quads in reference but not in your output (missing):',
        extra    : 'Quads in your output but not in reference (extra):',
        incorrect: 'Quads with an incorrect IN or OUT set:'
    };

    var setHeaders = {
        inSet  : 'IN:',
        outSet : 'OUT:',
        missing: 'Element in reference but not in your output (missing):',
        extra  : 'Element in your output but not in reference (extra):'
    };

    _.forIn(discrepancies, function (value, key) {
        if (_.isEmpty(value)) {
            return;
        }

        console.log('\n' + quadHeaders[key]);

        // MISSING or EXTRA
        if (_.isArray(value)) {
            return printSet(value);
        }

        // INCORRECT
        var indent = '    ';

        // for each quad with issues
        _.forIn(value, function (issues, quadId) {
            console.log(indent + quadId + ':');

            // for each set with issues (IN/OUT)
            _.forIn(issues, function (setIssues, setKind) {
                console.log(_.repeat(indent, 2) + setHeaders[setKind]);

                // for each kind of set issue (MISSING/EXTRA)
                _.forIn(setIssues, function (elements, setIssueKind) {
                    console.log(_.repeat(indent, 3) + setHeaders[setIssueKind]);
                    printSet(elements, _.repeat(indent, 4), '\n' + _.repeat(indent, 4));
                });
            });
        });
    });
}
