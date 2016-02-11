/**
 * Created by sridharrajs on 2/10/16.
 */

const gulp = require('gulp');

const babel = require('gulp-babel');
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');
const eslint = require('gulp-eslint');

var runSequence = require('run-sequence');

const FILES = {
	SERVER_JS_FILES: ['gulpfile.js', 'app/**/*.js'],
	CLIENT_JS_FILES: ['public/**/*.js', '!public/bower_components{,/**}']
};

const DIST = 'public/dist';

gulp.task('compile-js', () => {
	return gulp
		.src(FILES.CLIENT_JS_FILES)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(DIST));
});

gulp.task('jscs', () => {
	return gulp.src(FILES.SERVER_JS_FILES)
		.pipe(jscs({
			fix: false
		}))
		.pipe(jscs.reporter())
		.pipe(jscs.reporter('fail'));
});

gulp.task('jshint', function () {
	return gulp.src(FILES.SERVER_JS_FILES)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('eslint', function () {
	return gulp
		.src(FILES.SERVER_JS_FILES)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('lints', (callback)=> {
	runSequence('jshint', 'eslint', 'jscs', callback);
});