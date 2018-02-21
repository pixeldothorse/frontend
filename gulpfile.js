'use strict';

const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const log = require('fancy-log');
const tsify = require('tsify');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const glob = require('glob');
const es = require('event-stream');
const rename = require('gulp-rename');
const babelify = require('babelify');
const autoprefixer = require('gulp-autoprefixer');
const watch = require('gulp-watch');

gulp.task('build:ts', function (done) {
	glob('./src/ts/main-**.ts', function (err, files) {
		if (err) done(err);

		var tasks = files.map(function (entry) {
			return browserify({ entries: [entry], debug: true })
				.plugin(tsify)
				.transform(babelify, {
					presets: ['env'],
					extensions: ['.tsx', '.ts']
				})
				.bundle()
				.on('error', error => { error.showStack = false; done(error); })
				.pipe(source(entry))
				.pipe(rename(function (opt) {
					opt.dirname = '';
					opt.extname = '.min.js';
					opt.basename = opt.basename.replace(/^main\-/, '')
					return opt;
				}))
				.pipe(buffer())
				.pipe(sourcemaps.init({ largeFile: true, loadMaps: true }))
					.pipe(uglify())
					.on('error', error => { error.showStack = false; done(error); })
				.pipe(sourcemaps.write('./'))
				.pipe(gulp.dest('./dist/js/'));
		});

		es.merge(tasks).on('end', done);
	});
});

gulp.task('build:sass', function (done) {
	gulp.src(['./src/scss/*.scss', './src/scss/**/*.scss'])
		.pipe(sourcemaps.init())
			.pipe(sass({ outputStyle: 'compressed' }).on('error', error => {
				error.showStack = false;
				error.toString = function() {
					return this.message;
				};
				done(error);
			}))
			.pipe(autoprefixer())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/css/'))
		.on('end', done);
});

gulp.task('build:html', function () {
	return gulp.src(['src/*.html', 'src/**/*.html'])
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['build:ts', 'build:sass', 'build:html']);

gulp.task('watch:ts', function() {
	watch(['./src/ts/*.ts', './src/ts/**/*.ts'], function() {
		gulp.start('build:ts');
	})
});

gulp.task('watch:sass', function() {
	watch(['./src/scss/*.scss', './src/scss/**/*.scss'], function() {
		gulp.start('build:sass');
	})
});

gulp.task('watch:html', function() {
	watch(['src/*.html', 'src/**/*.html'], function() {
		gulp.start('build:html');
	})
});

gulp.task('watch', ['watch:ts', 'watch:sass', 'watch:html']);

gulp.task('default', ['build']);
