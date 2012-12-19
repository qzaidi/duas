"use strict";

var settings = require('./settings');
var imageresize = require('./imageresize');

module.exports = function(app) {
  app.get('/', function(req,res) {
    res.render('index');
  });

  app.get('/about', function(req,res) {
    res.render('about');
  });

  app.get('/teachings', function(req,res) {
    res.render('teachings/index');
  });

  app.get('/teachings/:episode', function(req,res) {
    res.render('teachings/' + req.params.episode);
  });

  app.get('/social', function(req,res) {
    res.render('social');
  });

  app.get('/settings', settings.index);
  app.get('/settings/:page', settings.page);
  app.post('/settings/feedback', settings.feedback);

  app.get(/^\/cache\/(\d+)x(\d+)\/(.*)$/, imageresize.render);

  require('./gallery')(app);
  require('./videos')(app);
  require('./dua')(app);
  require('./ziyarat')(app);


};
