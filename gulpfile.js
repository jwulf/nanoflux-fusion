var gulp = require('gulp');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var preprocess = require('gulp-preprocess');
var jasmine = require('gulp-jasmine');
var sequence = require('run-sequence');


gulp.task('build', function() {
	gulp.src('src/nanoflux-fusion.js')
		.pipe(browserify({
			standalone : "NanoFlux"
		}))
		.pipe(gulp.dest('./dist'))
});

gulp.task('build:uglify', function() {
	gulp.src('src/nanoflux-fusion.js')
		.pipe(browserify({
			standalone : "NanoFlux"
		}))
		.pipe(uglify({
			output : {
				ascii_only : true
			}
		}))
		.pipe(rename(function (path) {
			path.basename += ".min";
		}))
		.pipe(gulp.dest('./dist'))
});

gulp.task('build:test', function() {
	gulp.src('spec/*-spec.js')
		.pipe(preprocess({context: {DIST: true}}))
		.pipe(jasmine({verbose:true}));
});

gulp.task('default', function(cb){
	sequence('build','build:uglify','build:test',cb);
});
