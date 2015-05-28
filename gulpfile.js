var gulp = require('gulp'),
    html2js = require('gulp-html2js'),
    concat = require('gulp-concat'),
    bower = require('bower-files')({
        camelCase: false,
        overrides: {
            "jquery": {
                "main": [
                    "dist/**/*.*"
                ]
            },
            "bootstrap": {
                "main": [
                    "dist/**/*.*"
                ]
            },
            "font-awesome": {
                "main": [
                    "css/**/*.*",
                    "fonts/**/*.*"
                ]
            },
            "jquery-ui": {
                "main": [
                    "*.js",
                    "ui/*.js"
                ]
            },
        }
    });


gulp.task('bower', function(){

    var LIB_PATH = './src/anima/static/anima/lib/';

    for (var name in bower.deps) {

        gulp.src(bower.ext('js').deps[name])
            .pipe(gulp.dest(LIB_PATH + name + '/js/'));

        gulp.src(bower.ext('css').deps[name])
            .pipe(gulp.dest(LIB_PATH + name + '/css/'));

        gulp.src(bower.match('**/*.css.map').deps[name])
            .pipe(gulp.dest(LIB_PATH + name + '/css/'));

        gulp.src(bower.ext(['eot', 'woff', 'ttf', 'svg', 'woff2']).deps[name])
            .pipe(gulp.dest(LIB_PATH + name + '/fonts/'));
    }
});

gulp.task('templates', function () {
    gulp.src('./src/anima/static/anima/tpls/**/*.html')
        .pipe(html2js({
            outputModuleName: 'anima.templates',
            useStrict: true,
            base: './src/anima/static'
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('./src/anima/static/anima/js/'));
});


gulp.task('default', ['bower', 'templates'], function () {
    gulp.watch('./src/anima/static/anima/tpls/**/*.html', ['templates']);
});
