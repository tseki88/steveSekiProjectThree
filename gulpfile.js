'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;


// '$ gulp styles' task will run and compile the Sass to CSS.
// 'auto-prefixer' will support the last 2 versions of all browsers, Safari 5, IE 8 and 9 and Opera 12.1
// **NOTE** auto-prefixer does not enable Flexbox support on older browsers.
gulp.task('styles', () => {
    return gulp.src('./styles/partials/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./styles'))
        .pipe(reload({ stream: true }));
});

//'$ gulp watch' task when initiated will run:
// - 'scripts' task when a scripts;
// - 'styles' task when a SASS file is saved;
// - reload the page if the html updates;
gulp.task('watch', () => {
    gulp.watch('./styles/**/*.scss', gulp.series('styles'));
});


// '$ gulp' task initiates all tasks in the array, all by simply typing gulp.
// original code pre Gulp 4.0 
// gulp.task('default', ['browser-sync', 'styles', 'scripts', 'watch']);
gulp.task('default', gulp.series('styles', 'watch'));