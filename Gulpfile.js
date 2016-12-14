/**
 * Created by olivier on 2016-12-13.
 */

const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');


gulp.task('watch', () => {
	watch('index.jsx')
		.pipe(babel())
		.pipe(gulp.dest(__dirname))
});

gulp.task('default', () => {
	gulp.src('index.jsx')
	.pipe(babel())
	.pipe(gulp.dest(__dirname))
});