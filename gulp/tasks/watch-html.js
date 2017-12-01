const gulp = require('gulp');
const watch = require('gulp-watch');

const glob = [
    'src/server/**/*.html',
    'src/client/**/*.html',
    'src/shared/**/*.html',
];

module.exports = function() {
    return watch(glob, function() {
        gulp.start('build-html');
    });
};
