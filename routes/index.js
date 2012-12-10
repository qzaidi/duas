"use strict";


module.exports = function(app) {
  app.get('/', function(req,res) {
    res.render('index');
  });

  app.get('/about', function(req,res) {
    res.render('about');
  });

  app.get('/teachings', function(req,res) {
    res.render('teachings');
  });

  app.get('/social', function(req,res) {
    res.render('social');
  });

  require('./gallery')(app);
  require('./videos')(app);
  require('./dua')(app);

};
