var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var browserSync = require("browser-sync");
var notify = require("gulp-notify");
var pug = require("gulp-pug");
var browserify = require('browserify');
var source = require('vinyl-source-stream');

// gulp.task('default', ['sass', 'browser-sync', 'pug', 'watch']);
gulp.task('default', ['sass', 'browser-sync','js', 'watch']);

//sassとpugの監視をして変換処理させる
gulp.task('watch', () => {
  gulp.watch(['./sass/**'], () => {
    gulp.start(['sass']);
  });
  // gulp.watch(['./pug/**'], () => {
  //   gulp.start(['pug']);
  // });
  gulp.watch(['./js/**'], () => {
    gulp.start(['js']);
  });
});


gulp.task('js', function(){
  browserify({
    entries: ['js/app.js']
  })
  .bundle()
  .pipe(source('main.js'))
  .pipe(gulp.dest('docs/js/'));
});


//ブラウザ表示
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: "./docs/" //サーバとなるrootディレクトリ
    }
  });
  //ファイルの監視
  //以下のファイルが変わったらリロードする
  gulp.watch("./docs/js/**/*.js", ['reload']);
  gulp.watch("./docs/*.html", ['reload']);
});

//sassをcssに変換
gulp.task("sass", () => {
  gulp.src("./sass/*.scss")
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sass())
    .pipe(gulp.dest("./docs/css/"))
    //reloadせずにinjectする
    .pipe(browserSync.stream())
});


//pugをhtmlに変換
gulp.task("pug", () => {
  var option = {
    pretty: true
  }
  gulp.src("./pug/*.pug")
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(pug(option))
    .pipe(gulp.dest("./docs/"))
});

//ブラウザリロード処理
gulp.task('reload', () => {
  browserSync.reload();
});
