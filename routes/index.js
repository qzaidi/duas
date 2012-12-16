"use strict";

var settings = require('./settings');

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

  require('./gallery')(app);
  require('./videos')(app);
  require('./dua')(app);
  require('./ziyarat')(app);

};
