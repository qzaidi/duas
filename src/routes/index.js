"use strict";

var settings = require('./settings');
var imageresize = require('./imageresize');
var treatise = require('./treatise');
var home = require('./home');
var about = require('./about');
var salat = require('./salat');
var search = require('./search');
var events = require('./events');
var months = require('./months/months');
var quran = require('./quran');
var quote = require('./quote');
var gallery = require('./gallery');
var names = require('./names');
var praytimes = require('./praytimes');
var ratings = require('./ratings');
var verseofday = require('./verseofday');
var verses = require('./verses');
var tag = require('./tag');
var duasorg = require('./duasorg');
var hadith = require('./hadith');
var pdf = require('./pdf');
var slides = require('./slides');

var mw = require('./mw');

module.exports = function(app) {
  app.get('/', home.checkForSpecialOccasion, mw.hijri, verseofday.init, verseofday.get, home.index);
  app.get('/ramadhan', home.checkForSpecialOccasion, mw.hijri, verseofday.init, verseofday.get, home.ramadhan);

  app.get('/about', about.index);
  app.get('/about/:page', about.page);

  app.get('/asmaulhusna', names.index);
  app.get('/asmaulhusna/:id', names.get, quran.getverse, names.render);

  app.get('/events/:page', events.page);
  app.get('/amp/events/:page', events.amp);
  app.get('/events', mw.hijri, events.index);

  app.get('/month/:month',months.getName, months.getInfo, months.events,months.render);
  app.get('/month/', mw.hijri, months.getInfo, months.redirect);

  app.get('/teachings', function(req,res) {
    res.render('teachings/index');
  });

  app.get('/teachings/ahlebait', quran.getverses('mubahila',3,60,1),
                                 quran.getverses('book',6,37,1),
                                 quran.getverses('descent',6,83,2),
                                 mw.render('teachings/ahlebait'));

  app.get('/teachings/:episode', function(req,res) {
    res.render('teachings/' + req.params.episode);
  });

  app.get('/treatise/list', treatise.list);
  app.get('/treatise', treatise.index);
  app.get('/rights/:right', treatise.right);

  app.get('/quran',quran.getverses('nahl',16,97,1), mw.render('quran/home'));
  app.get('/random/quran',quran.random);
  app.get('/quran/index', quran.index);
  app.get('/quran/juz', quran.juz);

  app.get('/quran/topic/:topic', quran.topic);
  app.get('/quran/topics/:alpha',quran.topics);
  app.get('/quran/topics',quran.topicdir);

  app.get('/quran/salat', quran.getverses('fatiha',1,0,7), quran.getverses('kursi',2,254,3),
                          quran.getverses('mulk',3,25,2), quran.getverses('shahadah',3,17,2), 
                          quran.salat);

  app.get('/quran/hadith/:id', function(req,res) { res.redirect('/ahadith/quran/' + req.params.id, 301); });

  app.get('/ahadith/:hadith/:id', hadith.fetch, mw.render('hadith/hadith'));
  app.get('/ahadith', hadith.index, mw.render('hadith/index'));
  app.get('/random/hadith', hadith.random, mw.render('hadith/hadith'));

  app.get('/qunoot/:id', quran.qunoot,quran.chapterInfo,quran.getverse,quran.renderqunoot);
  app.get('/quote/:tag', quote.fetch,quote.render);
  app.get('/quran/:chapter/:verse-:v2',quran.chapterInfo,quran.getverse,quran.renderverse);
  app.get('/quran/:chapter/:verse', quran.chapterInfo, quran.getverse,quran.renderverse);
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
  app.get('/search', search.setup, quran.search, search.toc, events.search, gallery.search, salat.search, search.json);
  app.get('/autocomplete.json', search.toc, search.autocomplete);

  app.get('/prayertimes', praytimes.render);
  app.post('/prayertimes/savepos', praytimes.save);

  app.get('/gallery',gallery.index);
  app.get('/gallery/:image',gallery.render);

  require('./videos')(app);
  require('./dua')(app);
  require('./ziyarat')(app);

  require('./admin')(app);

  require('./months')(app);

  app.get('/rating',ratings.get,ratings.render);
  app.post('/rating',ratings.set);

  app.get('/tag/:tag', tag.listing);

  app.get('/landing', mw.hijri, duasorg.render);

  app.get('/nahjulbalagha',mw.render('nahj'));

  app.get('/salat', quran.getverses('ankaboot45',29,44,1),salat.index);

  app.get('/salat/:key', salat.verses, salat.duas, salat.render);

  app.get('/newsletter', mw.render('newsletter'));

  app.get('/slides',slides.index);

  app.get('/pdf/*',pdf.index);

  app.get('/*', mw.notfound);

};
