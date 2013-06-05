"use strict";

var settings = require('./settings');
var imageresize = require('./imageresize');
var treatise = require('./treatise');
var home = require('./home');
var about = require('./about');
var search = require('./search');
var events = require('./events');
var months = require('./months/months');
var quran = require('./quran');
var gallery = require('./gallery');

var mw = require('./mw');

module.exports = function(app) {
  app.get('/', home.checkForSpecialOccasion, mw.hijri, home.index);

  app.get('/about', about.index);
  app.get('/about/:page', about.page);

  app.get('/events/:page', events.page);
  app.get('/events', mw.hijri, events.index);

  app.get('/month/:month',months.getName, months.events,months.render);
  app.get('/month/', mw.hijri,months.events,months.render);

  app.get('/teachings', function(req,res) {
    res.render('teachings/index');
  });

  app.get('/teachings/:episode', function(req,res) {
    res.render('teachings/' + req.params.episode);
  });

  app.get('/treatise/list', treatise.list);
  app.get('/treatise', treatise.index);
  app.get('/rights/:right', treatise.right);

  app.get('/quran',quran.home);
  app.get('/random/quran',quran.random);
  app.get('/quran/index',quran.index);
  app.get('/qunoot/:id', quran.qunoot,quran.chapterInfo,quran.getverse,quran.renderqunoot);
  app.get('/quran/:chapter/:verse', quran.getverse,quran.renderverse);
  app.get('/quran/:chapter', quran.chapterInfo,quran.chapter, quran.html);
  app.get('/api/quran', quran.api, quran.json);
  app.get('/offline', mw.render('quran/offline'));

  app.get('/settings', settings.index);
  app.post('/settings/language',settings.updateLanguage,settings.page);
  app.post('/settings/quran',settings.updateQuran,settings.page);
  app.get('/settings/:page', settings.page);
  app.post('/settings/feedback', settings.feedback);
  app.get('/privacy',mw.render('settings/privacy'));

  app.get(/^\/cache\/(\d+)x(\d+)\/(.*)$/, imageresize.render);

  app.get('/searchpage', search.render);
  app.get('/search', search.toc, events.search, gallery.search, search.json);

  app.get('/gallery',gallery.index);
  app.get('/gallery/:image',gallery.render);

  require('./videos')(app);
  require('./dua')(app);
  require('./ziyarat')(app);

  require('./admin')(app);

  require('./months')(app);

  app.get('/*', mw.notfound);

};
