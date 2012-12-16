"use strict";
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var proc = require('ptmproc');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3786);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  require('./lib/view')(app);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

proc.init(app);
