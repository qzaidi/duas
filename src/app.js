"use strict";
/**
 * Module dependencies.
 */

var express = require('express')
var favicon = require('serve-favicon')
var http = require('http')
var path = require('path')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var methodOverride = require('method-override')
var session = require('express-session')
var errorhandler = require('errorhandler')


var app = express();

app.set('port', process.env.PORT || 3786);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname,'../public','favicon.ico')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(morgan('tiny'));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser('your secret here'));
app.use(session({
    secret: 'golden bear',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

require('./lib/view')(app);

require('./routes')(app);

var env = process.env.NODE_ENV || 'development';
if (env == 'development') {
  app.use(errorhandler());
}

if (env == 'production') {
  app.use(require('./routes/mw').error);
}



http.createServer(app)
    .on('error', function(err) {
      console.log('Error creating server ' + err);
      process.exit(1);
    })
    .listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port')
    );
});

app.listen(app.port)
