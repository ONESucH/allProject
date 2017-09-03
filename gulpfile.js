'use strict';
const gulp = require('gulp'),
    browserSync = require('browser-sync').create(), // Обновляет страницу
    less = require('gulp-less'), // Компиляция .less в .css
    plumber = require('gulp-plumber'), // Удерживает консоль в рабочем состоянии при ошибке
    cleanCSS = require('gulp-clean-css'), // Минифицирование фалов .css
    postCss = require('gulp-postcss'), // Поддержка верстки в Explorer(кроссбраузерность)
    rename = require('gulp-rename'), // Переименование файлов
    imagemin = require('gulp-imagemin'), // Сжатие png jpeg jpg gif
    autoPrefix = require('autoprefixer'), // Расставляет префиксы в .css(кроссбраузерность)
    uglify = require('gulp-uglify'), // Минификация JS
    pump = require('pump'); // Доп. пакет для minifier(js)

gulp.task('connect', function () {
    browserSync.init({
        server: 'app/'
    });
    gulp.watch([
        'app/**/*.less'
    ], ['build']);
    gulp.watch([
        'app/*.html'
    ], ['watchHtml']);
    gulp.watch([
        'app/js/*.js'
    ], ['watchJs']);
});

gulp.task('watchHtml', function () {
    browserSync.reload();
});

gulp.task('watchJs', function (cb) {
    pump([
        gulp.src(['app/js/*.js', '!app/js/*.min.js']),
        plumber(),
        uglify(),
        rename({suffix: '.min'}),
        gulp.dest('app/js')
    ], cb);
    browserSync.reload();
});

gulp.task('reduce', function () {
    gulp.src('app/images/*.*')
        .pipe(plumber())
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{removeViewBox: true}]
        }))
        .pipe(gulp.dest('app/images/'));
});

gulp.task('build', function () {
    gulp.src(['app/**/*.less', '!app/vendor/*'])
        .pipe(plumber())
        .pipe(less())
        .pipe(cleanCSS({debug: true}, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(postCss([autoPrefix({browsers: ['> 1%', 'IE 10'], cascade: false})]))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/'));
    browserSync.reload();
});

gulp.task('default', ['connect', 'build', 'watchHtml', 'watchJs']);