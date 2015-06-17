var gulp = require('gulp'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	del = require('del');

var lessFiles = "styles.src/*.less";
var outputStyles = "styles";
var scriptFiles = "scripts.src/*.js";
var outputSscripts = "scripts";

// 编译所有样式表
gulp.task("styles", function() {
	return gulp.src(lessFiles)
		.pipe(less())
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		// .pipe(gulp.dest('public/stylesheets/'))
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(minifycss())
		.pipe(gulp.dest(outputStyles))
		.pipe(notify({
			message: '样式表全部重新编译完成。'
		}));
});

// 编译所有脚本
gulp.task("scripts", function() {
	return gulp.src(scriptFiles)
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		.pipe(concat('main.js'))
		// .pipe(gulp.dest('public/scripts/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest(outputSscripts))
		.pipe(notify({
			message: '脚本全部重新编译完成。'
		}));
});

// CLEAN
gulp.task("clean", function(cb) {
	del([outputStyles, outputSscripts], cb)
});

// 如有变动，全部重新编译
gulp.task("run", function() {
	// Watch .LESS files
	gulp.watch(lessFiles, ['styles']);
	// Watch .js files
	gulp.watch(scriptFiles, ['scripts']);
});


// 默认任务
gulp.task('default', function() {
	gulp.watch(lessFiles, function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		less2css(event.path);
	});

	gulp.watch(scriptFiles, function(event) {
		console.log("脚本文件：" + event.path + "  事件类型：" + event.type);
		scriptFn(event.path);
	});
});

// 样式表单个编译
function less2css(files) {
	return gulp.src(files)
		.pipe(less())
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(outputStyles))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifycss())
		.pipe(gulp.dest(outputStyles))
		.pipe(notify({
			message: '样式表任务完成。'
		}));
}

// 脚本单个编译
function scriptFn(files) {
	return gulp.src(files)
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		// .pipe(concat("main.js"))
		.pipe(gulp.dest(outputSscripts))
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(uglify())
		.pipe(gulp.dest(outputSscripts))
		.pipe(notify({
			message: '脚本任务完成。'
		}));
}