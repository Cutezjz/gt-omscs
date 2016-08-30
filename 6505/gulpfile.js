'use strict';

var _        = require('lodash');
var gulp     = require('gulp');
var exit     = require('gulp-exit');
var jshint   = require('gulp-jshint');
var eslint   = require('gulp-eslint');
var mocha    = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

var paths = {
  js: [
    'gulpfile.js',
    'index.js',
    'constants.js',
    'lib/**/*.js'
  ],
  tests: [
    'test/**/*.spec.js'
  ],
  complexity: [
    'complexity/**/*.spec.js'
  ]
};

var allPaths = _.union(paths.js, paths.tests, paths.complexity);

gulp.task('jshint', function () {
  return gulp.src(allPaths)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('eslint', function () {
  return gulp.src(allPaths)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', function () {
  return gulp.src(paths.js)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(paths.tests)
        .pipe(mocha({reporter: 'spec'}))
        .pipe(istanbul.writeReports())
        .pipe(exit());
    });
});

gulp.task('complexity', function () {
  return gulp.src(paths.complexity).pipe(mocha({reporter: 'spec'}));
});

gulp.task('watch', function () {
  gulp.watch(allPaths, ['jshint', 'eslint']);
});

gulp.task('default', ['jshint', 'eslint']);
