const gulp = require("gulp");

module.exports = function() {
    gulp.src("./src/client/*.html")
        .pipe(gulp.dest("./public"));
};
