var gulp = require('gulp')
var browserSync = require('browser-sync').create()
var sass = require('gulp-sass')
var babel = require('babelify')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var watchify = require('watchify')

// Server dev
gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
})

gulp.task('sass', function () {
  gulp
    .src('./src/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream())
})

function compile (watch) {
  var bundle = browserify('./src/js/index.js', {debug: true})

  if (watch) {
    bundle = watchify(bundle)
    bundle.on('update', function () {
      console.log('--> Bundling...')
      rebundle()
    })
  }

  function rebundle () {
    bundle
      .transform(babel, { presets: ['es2015'], sourceMaps: false })
      .bundle()
      .on('error', function (err) {
        console.log(err)
        this.emit('end')
      })
      .pipe(source('index.js')) /* transformacion de lo que nos mando bundle() de browserify para que lo entienda gulp */
      .pipe(gulp.dest('./assets/js'))
      .pipe(browserSync.stream())
  }
  rebundle()
}

gulp.task('build', function () {
  return compile()
})

gulp.task('buildWatch', function () {
  return compile(true)
})

// Watch changes
gulp.task('watch', function () {
  gulp.watch('./src/sass/*.scss', ['sass'])
  // gulp.watch('./src/js/*.js', ['buildWatch'])
  gulp.watch('./*.html').on('change', browserSync.reload)
})

gulp.task('default', ['watch', 'serve', 'buildWatch'])
