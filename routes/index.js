"use strict";

var settings = require('./settings');
var imageresize = require('./imageresize');
var treatise = require('./treatise');
var home = require('./home');
var about = require('./about');
var search = require('./search');
var events = require('./events');
var quran = require('./quran');

var mw = require('./mw');

module.exports = function(app) {
  app.get('/', home.checkForSpecialOccasion, mw.hijri, home.index);

  app.get('/about', about.index);
  app.get('/about/:page', about.page);

  app.get('/events/:page', events.page);
  app.get('/events', mw.hijri, events.index);

  app.get('/teachings', function(req,res) {
    res.render('teachings/index');
  });

  app.get('/teachings/:episode', function(req,res) {
    res.render('teachings/' + req.params.episode);
  });

  app.get('/treatise/list', treatise.list);
  app.get('/treatise', treatise.index);
  app.get('/rights/:right', treatise.right);

  app.get('/quran',quran.index);
  app.get('/quran/:chapter/:verse', quran.verse);
  app.get('/quran/:chapter', quran.chapter);

  app.get('/settings', settings.index);
  app.post('/settings/language',settings.updateLanguage,settings.page);
  app.post('/settings/quran',settings.updateQuran,settings.page);
  app.get('/settings/:page', settings.page);
  app.post('/settings/feedback', settings.feedback);

  app.get(/^\/cache\/(\d+)x(\d+)\/(.*)$/, imageresize.render);

  app.get('/search', search.toc, search.events, search.render);

  require('./gallery')(app);
  require('./videos')(app);
  require('./dua')(app);
  require('./ziyarat')(app);

  require('./admin')(app);

  app.get('/*', mw.notfound);



};
