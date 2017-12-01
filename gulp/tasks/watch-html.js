const gulp = require("gulp");
const watch = require("gulp-watch");

const glob = [
    'src/server/**/*.html',
    'src/client/**/*.html',
    'src/shared/**/*.html',
];

module.exports = function() {
    gulp.start("build-html");
    return watch("src/client/index.html", function() {
        gulp.start("build-html");
    });
};
