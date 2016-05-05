var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
 
gulp.task('styles', function () {
  return gulp.src('*.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
     .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8'],
            cascade: false
        }))
    .pipe(gulp.dest('.'));
});

 
gulp.task('watch', function () {
  gulp.watch('*.scss', ['styles']);

});
