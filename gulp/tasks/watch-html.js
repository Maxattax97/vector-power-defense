const gulp = require("gulp");
const watch = require("gulp-watch");

module.exports = function() {
    gulp.start("build-html");
    return watch("src/client/index.html", function() {
        gulp.start("build-html");
    });
};
