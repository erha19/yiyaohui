var gulp = require('gulp'),
    minifyJS = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-htmlmin'),
    stripDebug = require('gulp-strip-debug');
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    ngHtml2Js = require("gulp-ng-html2js"),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    RevAll = require('gulp-rev-all'),
    autoprefixer = require('gulp-autoprefixer'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    deleteFile = require('del'),
    rev = require('gulp-rev-append'),
    reload      = browserSync.reload;
    SRC=__dirname+'/src',
    DIST=__dirname+'/dist',
    PATH={
        Cssfile:[SRC+'/css/**/*.css'],
        Jsfile:[SRC+'/js/**/*.js'],
        Copyfile:[SRC+'/images/**/*'],
        HtmlFile:[]
    }

function css() {
    return gulp.src(PATH.Cssfile)
        .pipe(concat('common.min.css'))
        .pipe(changed(SRC))
        .pipe(minifyCSS())
        .pipe(gulp.dest(DIST + '/styles'));
}

function js() {
    return gulp.src(PATH.Jsfile)
        .pipe(plumber())
        .pipe(stripDebug())
        .pipe(changed(SRC))
        .pipe(minifyJS())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(DIST+'/js'));
}


function md5() {
    var revall = new RevAll({
        dontRenameFile: [/^\/index\.html$/, /^\/favicon.ico$/g],
        transformFilename: function(file, hash) {
            return hash + file.path.slice(file.path.lastIndexOf('.'));
        }
    });
    return gulp.src([DIST + '/**'])
        .pipe(revall.revision())
        .pipe(gulp.dest(DIST))
        .pipe(revall.manifestFile())
        .pipe(gulp.dest(DIST));
}

function copy() {
    return gulp.src(PATH.Copyfile)
        .pipe(changed(DIST))
        .pipe(gulp.dest(DIST+'/images'));
}

function html() {
    return gulp.src(PATH.HtmlFile)
        .pipe(changed(DIST))
        .pipe(minifyHTML({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(DIST));
}

function rel() {
    return gulp.src(DIST + '/index.html')
        .pipe(changed(DIST + '/index.html'))
        .pipe(rev())
        .pipe(gulp.dest(DIST));
}

function sync() {
    var files = [
        './src/**/*.html',
        './src/styles/**/*.css',
        './src/images/**/*.{png,jpg,gif}',
        './src/**/*.js'
    ];
    browserSync.init(files, {
        server: {
             baseDir: './src'
        }
    });
    gulp.watch("./sass/*.scss", ['sass']);
    gulp.watch(files).on('change', reload);
}

gulp.task('sass', function(){
    return gulp.src(SRC+'sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('./css'))
        .pipe(reload({stream: true}));
});

gulp.task('browser-sync',['sass'],sync);

gulp.task('js',js)

gulp.task('css',css)

gulp.task('copy',copy)

gulp.task('md5',md5)

gulp.task('rel',rel)

gulp.task('default', ['md5']);