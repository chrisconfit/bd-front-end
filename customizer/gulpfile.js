var gulp    = require('gulp');
var concat = require('gulp-concat');
var uglify  = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var ngHtml2Js = require("gulp-ng-html2js");
var compass = require('gulp-compass');
var gutil = require('gulp-util');
var closureCompiler = require('gulp-closure-compiler');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var path = require('path');
var debug = require('gulp-debug');
var fs = require("fs");
var config = JSON.parse(fs.readFileSync('../private/awsaccess.json'));
var s3 = require('gulp-s3-upload')(config);


var closureScripts = [
	'./vendor/closure-library/base.js',
	'./vendor/blue-delta-sdk/API/Client/Address.js',
	'./vendor/blue-delta-sdk/API/Client/Button.js',
	'./vendor/blue-delta-sdk/API/Client/ButtonsListResponse.js',
	'./vendor/blue-delta-sdk/API/Client/Fabric.js',
	'./vendor/blue-delta-sdk/API/Client/FabricsListResponse.js',
	'./vendor/blue-delta-sdk/API/Client/Jean.js',
	'./vendor/blue-delta-sdk/API/Client/JeansListResponse.js',	
	'./vendor/blue-delta-sdk/API/Client/Measurement.js',
	'./vendor/blue-delta-sdk/API/Client/Comment.js',
	'./vendor/blue-delta-sdk/API/Client/CommentsListResponse.js',
	'./vendor/blue-delta-sdk/API/Client/Order.js',
	'./vendor/blue-delta-sdk/API/Client/OrderItem.js',
	'./vendor/blue-delta-sdk/API/Client/OrdersListResponse.js',
	'./vendor/blue-delta-sdk/API/Client/Thread.js',
	'./vendor/blue-delta-sdk/API/Client/ThreadsListResponse.js',
	'./vendor/blue-delta-sdk/API/Client/Transaction.js',
	'./vendor/blue-delta-sdk/API/Client/User.js',
	'./vendor/blue-delta-sdk/API/Client/UsersListResponse.js',
	'./vendor/blue-delta-sdk/API/Client/DefaultApi.js'];
	
gulp.task('bdapi_scripts', function() {
  return gulp.src(closureScripts)
    .pipe(closureCompiler({
      compilerPath: 'closure-compiler.jar',
      fileName: 'bdapi.min.js'
    }))
    .pipe(gulp.dest('dist/scripts'));
});

var appScripts = [
'!./vendor/*.js',
'!./vendor/**/*.js',
'!./node_modules/**/*.js',
'!./node_modules/*.js',
'!./bower_components/**/*.js',
'!./bower_components/*.js',
'!./dist/*.js',
'!./dist/*/**.js',
'!./gulpfile.js',
'./**/*.js'];

gulp.task('app_scripts', function(){
	gulp.src(appScripts)
		.pipe(sourcemaps.init())
		.pipe(uglify({mangle: true}).on('error', gutil.log))
		.pipe(concat('./app.min.js'))  
		.pipe(gulp.dest('dist/scripts'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/scripts'));
});


gulp.task('vendor_scripts', function() {
	gulp.src([
		'!./vendor/blue-delta-sdk/**/*.js',
		'./vendor/angular/angular.min.js',
		'./vendor/angular/*!(angular.min).js',
		'./vendor/aws/aws-cognito-sdk.js',
		'./vendor/aws/amazon-cognito-identity.js',
		'./vendor/aws/aws-sdk.js',
		'../shared-services/**/*.js'])
		.pipe(debug())
		.pipe(sourcemaps.init())
		.pipe(uglify({mangle: true}).on('error', gutil.log))
		.pipe(concat('./vendor.min.js'))  
		.pipe(gulp.dest('dist/scripts'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles', function() {
  return gulp.src(['./scss/**/*.scss'])
    .pipe(compass({
      css: './dist/styles/',
      sass: './scss/'
    }))
    .pipe(gulp.dest('./dist/styles'))
})


gulp.task('watch', function() {
  watch(appScripts, function () {
    gulp.start('app_scripts');
  });
  watch(['!./vendor/blue-delta-sdk/**/*.js','./vendor/**/*.js', '../shared-services/**/*.js'], function () {
    gulp.start('vendor_scripts');
  });
  watch(['./vendor/blue-delta-sdk/**/*.js'], function () {
    gulp.start('bdapi_scripts');
  });
  watch(['./scss/*.scss', './scss/**/*.scss'], function () {
    gulp.start('styles');
  });
});

gulp.task('default', ['scripts', 'watch']);






function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;


  routes = {
    '/bower_components': 'bower_components'
  };

  var server = {
    baseDir: baseDir,
    routes: routes
  };
  
  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser,
    port: 4000
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(".tmp", '/serve'), "./"]);
});


gulp.task("deploy", function() {
	var dist = [
		'!./private/**',
		'!./node_modules/**',
		'!./bower_components/**',
		'!./.sass-cache/**',
		'!./scss/**',
		'!./vendor/**',
		'./**',
	];
  gulp.src(dist)
	.pipe(s3({
	  Bucket: 'build.bluedeltajeans.com', //  Required 
	  ACL:    'public-read'       //  Needs to be user-defined 
	}, {
	  maxRetries: 5
	}));
});

gulp.task("deploy:dev", function() {
    var dist = [
        '!./private/**',
        '!./node_modules/**',
        '!./bower_components/**',
        '!./.sass-cache/**',
        '!./scss/**',
        '!./vendor/**',
        './**',
    ];
    gulp.src(dist)
        .pipe(s3({
            Bucket: 'bdbuild.devclients.com', //  Required
            ACL:    'public-read'       //  Needs to be user-defined
        }, {
            maxRetries: 5
        }));
});

