// Defining requirements
var autoprefixer = require('autoprefixer'),
	browserSync = require('browser-sync').create(),
	cleanCSS = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	del = require('del'),
	gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
	postcss = require('gulp-postcss'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	rev = require('gulp-rev'),
	revDel = require('rev-del'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify');


//the title and icon that will be used for the Grunt notifications
var notifyInfo = {
	title: 'Gulp',
	// icon: path.join(__dirname, 'gulp.png')
};

//error notification settings for plumber
var plumberErrorHandler = {
	errorHandler: notify.onError({
		title: notifyInfo.title,
		icon: notifyInfo.icon,
		message: "Error: <%= error.message %>"
	})
};

// Configuration file to keep your code DRY
const cfg = require('./gulpconfig.json');
const paths = cfg.paths;

// Compile SCSS to CSS
function scss() {
	return gulp.src(paths.sass + '/*.scss')
		.pipe(plumber(plumberErrorHandler))
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(sass()).on('error', sass.logError)
		.pipe(postcss([
			autoprefixer()
		]))
		.pipe(sourcemaps.write(undefined, {
			sourceRoot: null
		}))
		.pipe(gulp.dest(paths.css));

}

exports.scss = scss;

// Minify CSS
function minifycss() {
	return gulp.src(paths.css + '/style.css')
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(cleanCSS({
			compatibility: '*'
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.css));

}

exports.minifycss = minifycss;



gulp.task('deploy', function (done) {

	// Copy all JS files
	gulp.src(paths.js + '/main.min.js')
		.pipe(gulp.dest(paths.docs + '/js'));

	gulp.src('./index.html')
		.pipe(gulp.dest(paths.docs));

	done();
});

// Concatinate scripts and minify them
function scripts(done) {
	var scripts = [

		paths.dev + '/js/bootstrap.js',


		// paths.dev + '/js/skip-link-focus-fix.js',
		// Adding currently empty javascript file to add on for your own themes´ customizations
		// Please add any customizations to this .js file only!
		paths.dev + '/js/custom-javascript.js'
	];

	gulp.src(scripts)
		.pipe(concat('main.js'))
		.pipe(gulp.dest(paths.js));

	gulp.src(scripts)
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.js));

	return revision();

}

exports.scripts = scripts;

// BrowserSync reload helper function
function reload(done) {
	browserSync.reload();
	done();
}

function revision(done) {
	// by default, gulp would pick `assets/css` as the base,
	// so we need to set it explicitly:
	return gulp.src([paths.css + '/style.min.css', paths.js + '/main.min.js'], {
			base: './'
		})
		.pipe(rev())
		.pipe(gulp.dest('./')) // write rev'd assets to build dir
		.pipe(rev.manifest())
		.pipe(revDel({
			dest: './',
			force: true
		}))
		.pipe(gulp.dest('./')); // write manifest to build dir
	done();
}

exports.revision = revision;

// BrowserSync main task
gulp.task('watch', function (done) {
	// browserSync.init( cfg.browserSyncWatchFiles, cfg.browserSyncOptions );
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	gulp.watch('*.html', gulp.series(reload));
	gulp.watch(paths.sass + '/**/**/*.scss', gulp.series(scss, minifycss, revision, reload));
	gulp.watch([paths.dev + '/js/**/*.js', '!js/main.js', '!js/main.min.js'], gulp.series(scripts, reload));
	done();

});