var pkg = require('./package.json');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var browserify = require('gulp-browserify');

var lib = {
    jquery: './node_modules/jquery/dist/**',
    bootstrap: './node_modules/bootstrap/dist/**',
    "jquery.cookie": './node_modules/jquery.cookie/*.js'
};

var app_folder = {
    index: {},
    docmanage: {}
};

var site_dir = 'site';

gulp.task('default', ['library', 'site']);
gulp.task('site', ['html', 'app', 'static']);

/*
 站点第三方依赖库
 */
Object.keys(lib).forEach(function (name, index, array) {
    var source = lib[name];
    gulp.task('lib_' + name, function () {
        gulp.src(source)
            .pipe(gulp.dest(site_dir + '/lib/' + name));
    });
});

gulp.task('library', Object.keys(lib).map(function (name) {
    return 'lib_' + name;
}));

/*
 站点页面文件
 */
Object.keys(app_folder).forEach(function (name, index, array) {
    gulp.task('page_' + name, function () {
        var app = app_folder[name];
        var html = app.hasOwnProperty("html") ? app.html : './src/' + name + '/*/*.html';
        var source = [
            './src/' + name + '/header.html',
            html,
            './src/' + name + '/footer.html'
        ];
        gulp.src(source)
            .pipe(concat(name + '.html'))
            .pipe(gulp.dest(site_dir));
    });
});

gulp.task('html', Object.keys(app_folder).map(function (name) {
    return 'page_' + name;
}));

/*
 站点业务逻辑
 */
gulp.task('app', function () {
    gulp.src('./src/app.js')
        .pipe(browserify())
        .pipe(gulp.dest(site_dir));
});

gulp.task('cherry', function () {
    gulp.src('./src/cherry.js')
        .pipe(browserify())
        .pipe(gulp.dest(site_dir + '/js'));
});

/*
 站点静态文件，其他文件
 */
gulp.task('static', function () {
    gulp.src('./src/static/**')
        .pipe(gulp.dest(site_dir))
});


/*
 启动本地调试服务器
 */
gulp.task('serve', function () {
    connect.server({
        root: ['site'],
        host: '0.0.0.0',
        port: 3002,
        livereload: true,
        middleware: function (connect, opt) {
            var middlewares = [];
            try {
                middlewares = require('./proxy.json').map(function (opt) {
                    return proxy(opt);
                });
            } catch (e) {
                console.info('proxy.json not exist');
            }
            return middlewares;
        }
    });

    gulp.watch(['./src/**'], ['site']);
});
