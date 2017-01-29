var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('./db');    // sets database access

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', api);
// app.use('/', index);

/**
 * Development Settings
 */
var environment = app.get('env').trim();
if (environment === 'development') {
    console.log("In development mode - using " + path.join(__dirname, '../am-client/'));
    // This will change in production since we'll be using the public folder
    // This covers serving up the index page and the JS files
    // in production these will all be munged together by Grunt workflow
    // but in test we need to account for the variety of locations they may be in
    app.use(express.static(path.join(__dirname, '../am-client')));
//    app.use(express.static(path.join(__dirname, '../am-client/.tmp')));
    app.use(express.static(path.join(__dirname, '../am-client/app')));

    // Error Handling
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
 * Production Settings
 */
if (environment === 'production') {
    console.log("In production mode - using public");
    // changes it to use the optimized version for 
    console.log(path.join(__dirname, 'public'));
    app.use(express.static(path.join(__dirname, 'public')));

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}
module.exports = app;
