const gulp = require("gulp");
const browserify = require("browserify");
const watchify = require("watchify");
const source = require("vinyl-source-stream");

module.exports = function() {
    const bundler = watchify(browserify({
        entries: "./src/client/js/app.js",
        cache: {},
        debug: true,
    }));

    const bundle = function() {
        console.log("[        ] Starting '\x1b[36mbuild-js\x1b[0m'...");
        const start = process.hrtime();
        return bundler
            .bundle()
            .on("error", function() {})
            .pipe(source("bundle.js"))
            .pipe(gulp.dest("./public/"))
            .on("end", function() {
                const durTime = process.hrtime(start);
                let dur = (durTime[0]) + (durTime[1] / 1000000000);
                dur = Math.round(dur * 100) / 100;
                const buildStr = "\x1b[36mbuild-js\x1b[0m";
                const durStr = "\x1b[35m" + dur + " s\x1b[0m";
                console.log("[        ] Finished '%s' after %s",
                    buildStr, durStr);
            });
    };

    bundler.on("update", bundle);

    return bundle();
};
