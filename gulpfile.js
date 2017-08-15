var gulp = require('gulp');
var gulpif = require('gulp-if');
/*让文件加上hash后缀*/
var rev = require('gulp-rev');
/*让文件中的引入文件随着文件的后缀改变而改变为有hash后缀的文件*/
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var rootPath="http://localhost:8080/";
gulp.task('clean', del.bind(null, ['.tmp','.rev-*']));
/*将所有的除了html,css,js,map文件外的所有的文件加上hash后缀,并同时修改引入的文件名加上hash后缀*/
gulp.task("rev-other",function(){
    return gulp.src(".tmp/**/*")
        .pipe(gulpif('**/*.!(html|css|js|map)', rev()))
        .pipe(revReplace({prefix:rootPath}))
        .pipe(gulp.dest(".rev-other"))
        .pipe(rev.manifest())
        .pipe(gulp.dest(".rev-other"));
});
/*将js,css加上hash后缀*/
gulp.task("rev-js,rev-css",function(){
    return gulp.src(".rev-other/**/*")
        .pipe(gulpif('**/*.@(js|css)', rev()))
        .pipe(revReplace({prefix:rootPath}))
        .pipe(gulp.dest(".rev-js,rev-css"))
        .pipe(rev.manifest({cwd:'.rev-js,rev-css',merge:true}))
        .pipe(gulp.dest(".rev-js,rev-css"));
});
/*将html加上hash后缀*/
gulp.task("rev-html",function(){
    return gulp.src(".rev-js,rev-css/**/*")
        .pipe(gulpif("**/*.html",rev()))
        .pipe(revReplace({prefix:rootPath}))
        .pipe(gulp.dest(".rev-html"))
        .pipe(rev.manifest({cwd:'.rev-html',merge:true}))
        .pipe(gulp.dest(".rev-html"));
});
gulp.task("rev",gulpSequence("rev-other","rev-js,rev-css","rev-html"));
/*其他的操作,主要是其他操作都完毕以后再进行hash后缀的添加*/
gulp.task("other-operate",function(){
    return gulp.src("src/**/*")
        .pipe(useref())
        .pipe(gulp.dest(".tmp"));
});
gulp.task("build",gulpSequence("clean","other-operate","rev"));