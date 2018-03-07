'use strict';

var gulp = require('gulp');
var fs = require("fs");
var config = JSON.parse(fs.readFileSync('../private/awsaccess.json'));
var s3 = require('gulp-s3-upload')(config);

gulp.task("deploy", function() {
    return gulp.src('./dist/**')
        .pipe(s3({
            Bucket: 'dashboard.bluedeltajeans.com', //  Required
            ACL:    'public-read'       //  Needs to be user-defined
        }, {
            maxRetries: 5
        }));
});

gulp.task("deploy:dev", function() {
    return gulp.src('./dist/**')
        .pipe(s3({
            Bucket: 'bddash.devclients.com', //  Required
            ACL:    'public-read'       //  Needs to be user-defined
        }, {
            maxRetries: 5
        }));
});

