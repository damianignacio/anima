var gulp = require('gulp'),
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
            }
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
