/**
 * Created by sridharrajs on 2/10/16.
 */

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('ui', () => {
	return gulp
		.src(['public/**/*.js', '!public/bower_components{,/**}'])
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('public/dist'));
});

