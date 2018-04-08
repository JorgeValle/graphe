const gulp = require('gulp'),
      concat = require('gulp-concat'),
      minify = require('gulp-minify'),
      sass = require('gulp-sass'),
      cleanCSS = require('gulp-clean-css'),
      babel = require('gulp-babel');

/**
 * Prepares the scripts
 */
gulp.task('scripts', () => {
  return gulp.src([
    './node_modules/prismjs/prism.js',
    './node_modules/sticky-sidebar/src/sticky-sidebar.js'
  ])
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('./front/assets/'));
});

/**
 *
 */
gulp.task('prep', () => {
  gulp.src('./front/assets/scripts.js')
  .pipe(minify({
    ext: {
      min:'.min.js'
    }
  }))
  .pipe(babel())
  .pipe(gulp.dest('./front/assets/'))
});

/**
 *
 */
gulp.task('sass', () => {
  return gulp.src('./front/assets/styles/styles.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./front/assets/styles/'));
});

/**
 * 
 */
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

/**
 *
 */
gulp.task('minify-css', () => {
  return gulp.src('./front/assets/styles/styles.css')
  .pipe(cleanCSS({
    compatibility: 'ie8'
  }))
  .pipe(gulp.dest('./front/assets/styles/dist'));
});