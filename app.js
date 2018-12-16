"use strict";
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3786);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon('public/favicon.ico'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  require('./lib/view')(app);
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('production', function() {
  app.use(require('./routes/mw').error);
});

require('./routes')(app);

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
