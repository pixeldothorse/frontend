'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var log = require('fancy-log');
var tsify = require('tsify');
var sass = require('gulp-sass');
var htmlmin = require('gulp-htmlmin');

gulp.task('ts', function () {
	return browserify()
		.add('./src/ts/index.ts')
		.plugin(tsify)
		.bundle()
		.on('error', error => { log.error(error.toString()); })
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
			.pipe(uglify())
			.on('error', error => { log.error(error.toString()); })
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('sass', function () {
	return gulp.src(['./src/scss/*.scss', './src/scss/**/*.scss'])
		.pipe(sourcemaps.init())
			.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/css/'));
});

gulp.task('html', function () {
	return gulp.src(['src/*.html', 'src/**/*.html'])
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['ts', 'sass', 'html']);
