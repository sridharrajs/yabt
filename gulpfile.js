/**
 * Created by sridharrajs on 2/10/16.
 */

const gulp = require('gulp');

const babel = require('gulp-babel');
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');
const eslint = require('gulp-eslint');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
var browserSync = require('browser-sync').create();

const FILES = {
	SERVER_JS_FILES: ['gulpfile.js', 'app/**/*.js'],
	CLIENT_NON_JS_FILES: ['client/**/*.css', 'client/**/*.html'],
	CLIENT_JS_FILES: ['client/**/*.js'],
	CLIENT_FILES: ['client/**/*.js', 'client/**/*.css', 'client/**/*.html']
};

const DIST = 'public/';

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

gulp.task('jshint', ()=> {
	return gulp.src(FILES.SERVER_JS_FILES)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('eslint', () => {
	return gulp
		.src(FILES.SERVER_JS_FILES)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('lints', (callback)=> {
	runSequence('jshint', 'eslint', 'jscs', callback);
});

gulp.task('stream', ()=> {
	gulp.watch(FILES.CLIENT_FILES, ['compile-js', 'copy-html-css']);
});

gulp.task('browser-sync', ()=> {
	browserSync.init({
		server: {
			baseDir: './public/'
		}
	});
});

gulp.task('copy-html-css', ()=> {
	return gulp
		.src(FILES.CLIENT_NON_JS_FILES)
		.pipe(gulp.dest(DIST));
});