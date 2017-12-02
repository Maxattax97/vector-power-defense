const gulp = require("./gulp")([
    "build-html",
    "build-js",
    "watch-html",
    "watch-js",
    "watch-serve",
    "serve",
    "lint",
    "watch-lint",
]);

gulp.task("build", ["build-html", "lint", "build-js"]);
gulp.task("watch", ["watch-html", "watch-js", "watch-lint"]);

gulp.task("default", ["watch", "watch-serve"]);
