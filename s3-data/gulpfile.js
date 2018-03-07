var gulp    = require('gulp');
var fs = require("fs");
var config = JSON.parse(fs.readFileSync('../private/awsaccess.json'));
var s3 = require('gulp-s3-upload')(config);

gulp.task("deploy", function() {
	var dist = [
		'!./node_modules/**',
		'!./gulpfile.js',
		'!./package.json',
		'./**',
	];
  gulp.src(dist)
	.pipe(s3({
	  Bucket: 'bluedelta-data', //  Required 
	  ACL:    'public-read'       //  Needs to be user-defined 
	}, {
	  maxRetries: 5
	}));
});    
