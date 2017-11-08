const gulp = require('./gulp')([
  'build-html',
  'build-js',
  'watch-html',
  'watch-js',
]);

gulp.task('build', ['build-html', 'build-js']);
gulp.task('watch', ['watch-html', 'watch-js']);
gulp.task('serve', []);

gulp.task('default', ['build', 'watch', 'serve']);
