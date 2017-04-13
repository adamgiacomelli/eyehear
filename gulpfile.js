var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var gzip_options = {
  threshold: '1kb',
  gzipOptions: {
    level: 9
  }
};

var publicdir = "public/";

/* Compile Our Sass */
gulp.task('sass', function() {
  return gulp.src('development/style/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(publicdir + 'css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cleancss())
    .pipe(gulp.dest(publicdir + 'css'))
    .pipe(gzip(gzip_options))
    .pipe(gulp.dest(publicdir + 'css'))
    .pipe(livereload());
});


/* Compile Our JS */
gulp.task('js', function() {
  return gulp.src('development/scripts/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest(publicdir + 'js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(publicdir + 'js'))
    .pipe(livereload());
});


/* Frontend JS */
var vendor_scripts = [
  'node_modules/spectrogram/spectrogram.js',
];

gulp.task('vendor', function() {
  return gulp.src(vendor_scripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(publicdir + 'js'))
    .pipe(uglify({
      mangle: false
    })) //Breaks angular apps with mangle
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(publicdir + 'js'))
    .pipe(livereload());
});

/* Watch Files For Changes */
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('development/style/scss/*.scss', ['sass']);
  gulp.watch('development/scripts/*.js', ['js']);
});

gulp.task('default', ['sass', 'js', 'vendor', 'watch']);
