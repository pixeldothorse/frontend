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
const sorcery = require('sorcery');
const clean = require('gulp-clean');

gulp.task('clean:js', () => {
	return gulp.src('./dist/js', { read: false })
		.pipe(clean());
});

gulp.task('clean:css', () => {
	return gulp.src('./dist/css', { read: false })
		.pipe(clean());
});

gulp.task('clean:html', () => {
	return gulp.src(['./dist/*.html', './dist/**/*.html'], { read: false })
		.pipe(clean());
});

gulp.task('clean', ['clean:js', 'clean:css', 'clean:html']);

gulp.task('build:ts', ['clean:js'], done => {
	let errors = [];
	let sourceMapsBuilt = false;

	glob('./src/ts/main-**.ts', (err, files) => {
		if (err) {
			done(err);
			return;
		}

		let tasks = files.map(entry => {
			return browserify({ entries: [entry], debug: true })
				.plugin(tsify)
				.transform(babelify, {
					presets: ['modern-browsers'],
					extensions: ['.tsx', '.ts']
				})
				.bundle()
				.on('error', error => {
					if (!errors.includes(error.message)) errors.push(error.message);
				})
				.pipe(source(entry))
				.pipe(rename(opt => {
					opt.dirname = '';
					opt.extname = '.min.js';
					opt.basename = opt.basename.replace(/^main-/, '');
					return opt;
				}))
				.pipe(buffer())
				.pipe(sourcemaps.init({ largeFile: true, loadMaps: true }))
				.pipe(uglify())
				.pipe(sourcemaps.write('./'))
				.pipe(gulp.dest('./dist/js/'))
				.on('finish', () => {
					if (sourceMapsBuilt) return;

					sourceMapsBuilt = true;

					glob('./dist/js/**.min.js', (err, files) => {
						if (err) {
							errors.push(err.message);
							return;
						}

						files.map(file => {
							sorcery.load(file).then(chain => {
								chain.write();
							}).catch(() => {});
						});
					});
				});
		});

		es.merge(tasks).on('end', () => {
			let err;

			if (errors.length > 0) {
				err = new Error('\n' + errors.join('\n'));
				err.showStack = false;
			}

			done(errors.length > 0 ? err : undefined);
		});
	});
});

gulp.task('build:sass', ['clean:css'], done => {
	gulp.src(['./src/scss/*.scss', './src/scss/**/*.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'compressed' }).on('error', error => {
			error.showStack = false;
			error.toString = () => {
				return this.message;
			};
			done(error);
		}))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/css/'))
		.on('end', done);
});

gulp.task('build:html', ['clean:html'], () => {
	return gulp.src(['src/*.html', 'src/**/*.html'])
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['build:ts', 'build:sass', 'build:html']);

gulp.task('watch:ts', () => {
	watch(['./src/ts/*.ts', './src/ts/**/*.ts'], () => {
		gulp.start('build:ts');
	});
});

gulp.task('watch:sass', () => {
	watch(['./src/scss/*.scss', './src/scss/**/*.scss'], () => {
		gulp.start('build:sass');
	});
});

gulp.task('watch:html', () => {
	watch(['src/*.html', 'src/**/*.html'], () => {
		gulp.start('build:html');
	});
});

gulp.task('watch', ['build', 'watch:ts', 'watch:sass', 'watch:html']);

gulp.task('default', ['watch']);
