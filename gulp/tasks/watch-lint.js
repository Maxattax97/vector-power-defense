const gulp = require("gulp");
const watch = require("gulp-watch");

const glob = [
    "gulpfile.js",
    ".eslintrc.js",
    "gulp/**/*.js",
    "src/**/*.js",
];

module.exports = function() {
    gulp.start("lint");
    return watch(glob, function() {
        gulp.start("lint");
    });
};
