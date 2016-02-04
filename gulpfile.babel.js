'use strict';

import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import {output as pagespeed} from 'psi';
import pkg from './package.json';
import foreach from 'gulp-foreach';
import merge from 'merge-stream';
import zip from 'gulp-zip';
import debug from 'gulp-debug';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Lint JavaScript
gulp.task('lint', () =>
  gulp.src(['src/assets/js/**/*.js', '!src/assets/js/lib/**'])
    .pipe($.eslint({
      globals: { 
        'jQuery':true, 
        '$':true 
      },
      rules: {
        'padded-blocks': 0
      }
    }))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError()))
);

// Optimize images
gulp.task('images', () => {

  return gulp.src('src/**/*.html')

    .pipe($.foreach(function(stream, file){ 

      var htmlFileName = path.basename(file.path, '.html');

      // Global images
      var globalImages = gulp.src('src/assets/img/global/**/*')
        .pipe($.imagemin({
          progressive: true,
          interlaced: true
        }))

        .pipe(gulp.dest('build/'+ htmlFileName +'/assets/img/global'))

        .pipe($.size({title: 'global images:'}));

      // Individual slide images
      var slideImages = gulp.src('src/assets/img/' + htmlFileName + '/**/*')
        .pipe($.imagemin({
          progressive: true,
          interlaced: true
        }))

        .pipe(gulp.dest('build/'+ htmlFileName +'/assets/img/' + htmlFileName))

        .pipe($.size({title: 'slide images:'}));

      var slideThumbImages = gulp.src('src/assets/thumbs/' + htmlFileName + '/**/*')
        .pipe($.imagemin({
          progressive: true,
          interlaced: true
        }))

        .pipe(gulp.dest('build/'+ htmlFileName))

        .pipe($.size({title: 'thumb images:'}));

      // Merge streams for image output
      return merge(globalImages, slideImages, slideThumbImages);

    }))

});

// Optimize images
gulp.task('fonts', () => {

  return gulp.src('src/**/*.html')

    .pipe($.foreach(function(stream, file){ 

      var htmlFileName = path.basename(file.path, '.html');

      return gulp.src('src/assets/fonts/**/*')

        .pipe(gulp.dest('build/'+ htmlFileName +'/assets/fonts/'))

        .pipe($.size({title: 'fonts:'}));

    }))

});

// Copy all files at the root level (src)
gulp.task('copy', () =>
  gulp.src([
    'src/*',
    '!src/*.html',
    '!src/assets',
    'node_modules/apache-server-configs/build/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('build'))
    .pipe($.size({title: 'copy'}))
);

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {

  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src('src/**/*.html')

    .pipe($.foreach(function(stream, file){ 

      var htmlFileName = path.basename(file.path, '.html');

      // For best performance, don't add Sass partials to `gulp.src`
      return gulp.src([
        'src/assets/scss/**/*.scss'
      ])
        .pipe($.newer('.tmp/styles'))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
          precision: 10
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('.tmp/styles'))
        // Concatenate and minify styles
        .pipe($.if('*.css', $.cssnano()))
        .pipe($.size({title: 'styles'}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('build/'+ htmlFileName +'/assets/css'))
        .pipe(gulp.dest('src/assets/css'));
    }))

});

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enables ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
gulp.task('scripts', () => {

  return gulp.src('src/**/*.html')

    .pipe($.foreach(function(stream, file){ 

      var htmlFileName = path.basename(file.path, '.html');

      return gulp.src([
        // Note: Since we are not using useref in the scripts build pipeline,
        //       you need to explicitly list your scripts here in the right order
        //       to be correctly concatenated
        './src/assets/js/lib/jquery-1.12.0.min.js',
        // Add Script Libraries Here or Above
        // './src/assets/js/lib/YOURLIBRARY.js',
        './src/assets/js/main.js',
        './src/assets/js/' + htmlFileName + '.js'
      ])
      
        .pipe($.newer('.tmp/scripts'))
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/scripts' + '_' + htmlFileName))
        .pipe($.concat('main.min.js'))
        .pipe($.uglify({preserveComments: 'some'}))
        // Output files
        .pipe($.size({title: 'scripts'}))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('build/'+ htmlFileName +'/assets/js'));
        
    }))

});

// Scan your HTML for assets & optimize them
gulp.task('html', () => {

  return gulp.src('src/**/*.html')

    // For each HTML File
    .pipe($.foreach(function(stream, file){

      // Get HTML Filename and remove .html
      var htmlFileName = path.basename(file.path, '.html');

      // Return stream for each html file
      return stream

        // Useref
        .pipe($.useref({searchPath: '{.tmp,src}'}))

        // Remove any unused CSS
        .pipe($.if('*.css', $.uncss({
          html: [
            'src/index.html'
          ],
          // CSS Selectors for UnCSS to ignore
          ignore: []
        })))

        // Concatenate and minify styles
        // In case you are still using useref build blocks
        .pipe($.if('*.css', $.cssnano()))

        // Minify any HTML
        .pipe($.if('*.html', $.htmlmin({
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeOptionalTags: true
        })))

        // Output files
        .pipe($.if('*.html', $.size({title: 'html:', showFiles: true})))

        // Output into build + filename directory
        .pipe(gulp.dest('build/' + htmlFileName));

    }))
    // Output Location
    

});

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'build/*', '!build/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['scripts', 'styles'], () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMsrcing: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'src'],
    port: 3000
  });

  gulp.watch(['src/**/*.html'], reload);
  gulp.watch(['src/assets/scss/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['src/assets/js/**/*.js'], ['lint', 'scripts']);
  gulp.watch(['src/assets/img/**/*'], reload);
});

// Build and serve the output from the build build
gulp.task('serve:build', ['default'], () =>
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMsrcing: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'build',
    port: 3001
  })
);

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
  runSequence(
    'styles',
    ['lint', 'html', 'scripts', 'images', 'fonts', 'copy'],
    cb
  )
);

// Run PageSpeed Insights
gulp.task('pagespeed', cb =>
  // Update the below URL to the public URL of your site
  pagespeed('example.com', {
    strategy: 'mobile'
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb)
);

// Zip folders in build and output into a zipped folder in build
gulp.task('zip', function(){

   return gulp.src('./build/*')

       .pipe(foreach(function(stream, file){

          var fileName = file.path.substr(file.path.lastIndexOf('/')+1);

          gulp.src('./build/'+fileName+'/**/*')
              .pipe(zip(fileName+'.zip'))
              .pipe(gulp.dest('dist'));

          return stream;

       }));
});

