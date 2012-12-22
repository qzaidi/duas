"use strict";

var settings = require('./settings');
var imageresize = require('./imageresize');
var treatise = require('./treatise');

module.exports = function(app) {
  app.get('/', function(req,res) {
    var iosScripts = {};
    var ua = req.headers['user-agent'];
    
    if(/like Mac OS X/.test(ua)) {
      iosScripts = {
        css: '/css/add2home.css',
        js: '/js/add2home.js'
      };
    }

    res.render('index', {
      scripts: iosScripts
    });
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
