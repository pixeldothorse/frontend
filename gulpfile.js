'use strict';

const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify-es').default;
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
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const merge = require('gulp-merge-json');
const chalk = require('chalk');
const del = require('del');
const imagemin = require('gulp-imagemin');

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

gulp.task('clean:rev-manifest', () => {
	return gulp.src('./dist/rev-manifest*.json', { read: false })
		.pipe(clean());
});

gulp.task('clean:images', () => {
	return gulp.src('./dist/img', { read: false })
		.pipe(clean());
});

gulp.task('clean', ['clean:rev-manifest', 'clean:js', 'clean:css', 'clean:html', 'clean:images']);

gulp.task('build:ts', ['clean:js'], done => {
	let errors = [];
	let sourceMapsBuilt = false;
	let manifestCounter = 0;

	glob('./src/ts/main-**.ts', (err, files) => {
		if (err) {
			done(err);
			return;
		}

		let tasks = files.map(entry => {
			manifestCounter++;

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
				.on('error', error => {
					log.error(error.message);
					done(new Error());
				})
				.pipe(rev())
				.pipe(sourcemaps.write('./'))
				.pipe(gulp.dest('./dist/js/'))
				.pipe(rev.manifest(`rev-manifest-js-${manifestCounter}.json`))
				.pipe(gulp.dest('./dist'))
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
		.pipe(rename({ suffix: '.min' }))
		.pipe(rev())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/css/'))
		.pipe(rev.manifest('rev-manifest-css.json'))
		.pipe(gulp.dest('./dist'))
		.on('end', done);
});

gulp.task('build:images', ['clean:images'], () => {
	return gulp.src(['./src/img/*', './src/img/**/*'])
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('build:merge-rev-manifest', ['clean:rev-manifest', 'build:ts', 'build:sass', 'build:images'], () => {
	return gulp.src(['./dist/rev-manifest-css.json', './dist/rev-manifest-js-*.json'])
		.pipe(merge({ fileName: 'rev-manifest.json' }))
		.pipe(gulp.dest('./dist'));
});

gulp.task('build', ['clean:html', 'build:merge-rev-manifest'], () => {
	del('./dist/rev-manifest-*.json');

	let manifest = gulp.src('./dist/rev-manifest.json');

	return gulp.src(['src/*.html', 'src/**/*.html'])
		.pipe(revReplace({ manifest: manifest }))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('./dist/'))
		.on('end', () => {
			log.info(chalk.bold.green('Build completed!'));
		});
});

gulp.task('watch', ['build'], () => {
	watch(['src/*.html', 'src/**/*.html', './src/scss/*.scss', './src/scss/**/*.scss', './src/ts/*.ts', './src/ts/**/*.ts'], () => {
		log.warn(chalk.bold.yellow('Starting build. Please wait...'));
		gulp.start('build');
	});
});

gulp.task('default', ['watch']);
