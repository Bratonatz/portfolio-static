'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');


gulp.task('styles', () => {
    return gulp.src('scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe( sourcemaps.init() )
        .pipe( postcss([ require('autoprefixer'), require('postcss-nested'), require('postcss-pxtorem'), require('node-css-mqpacker') ]) )
        .pipe( sourcemaps.write('./sourcemaps') )
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('compiled/'));
});

gulp.task('watch', () => {
    gulp.watch('scss/*.scss', gulp.series(['styles']));
});

gulp.task('default', gulp.series(['styles', 'watch']));