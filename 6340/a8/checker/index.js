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
    var outDir = __dirname + '/../examples/' + parsedCommand.target + '/chord_output/';
    var refDir = __dirname + '/../sample_output/' + parsedCommand.target + '/';

    var reads = [];

    _.forEach(parsedCommand.files, function (file) {
        reads.push(readFile(refDir + file));
        reads.push(readFile(outDir + file));
    });

    return q.all(reads);
})
.then(function (fileContents) {
    var files = {};

    _.forEach(fileContents, function (contents, index) {
        var fileName = parsedCommand.files[Math.floor(index / 2)];
        files[fileName] = files[fileName] || [];
        files[fileName].push(contents);
    });

    return findDiscrepancies(files);
})
.then(printDiscrepancies)
.catch(console.error)
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
            target:   getFlag(args, ['test_case', 'test_case2']),
            analysis: getFlag(args, ['modref', 'escape'])
        };

        if (!_.isEmpty(_.pickBy(parsedCommand, _.isNull))) {
            return reject(usage());
        } else {
            if (parsedCommand.analysis === 'modref') {
                parsedCommand.files = [
                    'refStatField.txt',
                    'modStatField.txt',
                    'refInstField.txt',
                    'modInstField.txt'
                ];
            } else {
                parsedCommand.files = [
                    'localMH.txt'
                ];
            }
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
        '  target:   test_case, test_case2',
        '  analysis: modref, escape'
    ].join('\n');
}

/******************************************************************************
 * READ FILE
 ******************************************************************************/

/**
 * @description Read a file for discrepancy analysis.
 * @param {String} file File name.
 * @returns {Object} Contents if successful.
 * @throws {Error} If there is a problem with reading the file.
 */
function readFile(file) {
    return new q.Promise(function (resolve, reject) {
        fs.readFile(file, 'utf8', function (error, data) {
            if (error) {
                return reject('error reading ' + file);
            } else {
                return resolve(data.split('\n').clean());
            }
        });
    });
}

/******************************************************************************
 * COMPARE FILES
 ******************************************************************************/

/**
 * @description Compare two files to identify any discrepancies.
 * @param {Object} files Object containing `reference` and `actual` files.
 * @returns {Object} Discrepancies found.
 */
function findDiscrepancies(files) {
    return new q.Promise(function (resolve, reject) {
        var discrepancies = {};

        _.forEach(files, function (contents, fileName) {
            var refContents = contents[0];
            var outContents = contents[1];
            discrepancies[fileName] = {
                missing: _.pullAll(_.clone(refContents), outContents).clean(),
                extra  : _.pullAll(_.clone(outContents), refContents).clean()
            };
        });

        return resolve(discrepancies);
    });
}

/******************************************************************************
 * OUTPUT
 ******************************************************************************/

/**
 * @description Print discrepancies.
 * @param {Object} discrepancies
 */
function printDiscrepancies(discrepancies) {
    _.forEach(discrepancies, function (d, fileName) {
        console.log('CHECKING ' + fileName.replace(/\..*/i, '...'));

        var indent = '  ';

        if (d.missing.length === 0 && d.extra.length === 0) {
            return console.log(indent + 'Output matches expected.');
        }

        var kindHeaders = {
            missing: 'In expected but not in your output (missing):',
            extra  : 'In your output but not in reference (extra):'
        };

        _.forEach(['missing', 'extra'], function (kind) {
            if (d[kind].length > 0) {
                console.log(indent + kindHeaders[kind]);
                _.forEach(d[kind], function (val) {
                    console.log(indent + indent + val);
                });
            }
        });
    });
}
