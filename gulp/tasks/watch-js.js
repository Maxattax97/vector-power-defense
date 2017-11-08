const gulp = require('gulp');
const watch = require('gulp-watch');

module.exports = function() {
  return watch('src/client/js/**/*.js', function() {
    gulp.start('build-js');
  });
};
