"use strict";

var settings = require('./settings');
var imageresize = require('./imageresize');
var treatise = require('./treatise');
var home = require('./home');

module.exports = function(app) {
  app.get('/', home.checkForSpecialOccasion, home.index);

  app.get('/about', function(req,res) {
    res.render('about');
  });

  app.get('/teachings', function(req,res) {
    res.render('teachings/index');
  });

  app.get('/teachings/:episode', function(req,res) {
    res.render('teachings/' + req.params.episode);
  });

  app.get('/treatise', treatise.index);
  app.get('/rights/:right', treatise.right);

  app.get('/settings', settings.index);
  app.get('/settings/:page', settings.page);
  app.post('/settings/feedback', settings.feedback);

  app.get(/^\/cache\/(\d+)x(\d+)\/(.*)$/, imageresize.render);

  require('./gallery')(app);
  require('./videos')(app);
  require('./dua')(app);
  require('./ziyarat')(app);


};
