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

var mw = require('./mw');

module.exports = function(app) {
  app.get('/', home.checkForSpecialOccasion, mw.hijri, verseofday.init, verseofday.get, home.index);

  app.get('/about', about.index);
  app.get('/about/:page', about.page);

  app.get('/asmaulhusna', names.index);
  app.get('/asmaulhusna/:id', names.get, quran.getverse, names.render);

  app.get('/events/:page', events.page);
  app.get('/events', mw.hijri, events.index);

  app.get('/month/:month',months.getName, months.getInfo, months.events,months.render);
  app.get('/month/', mw.hijri, months.getInfo, months.redirect);

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
  app.get('/quran/juz', quran.juz);
  app.get('/quran/salat', quran.getverses('fatiha',1,0,7), quran.getverses('kursi',2,254,3),
                          quran.getverses('mulk',3,25,2), quran.getverses('shahadah',3,17,2), 
                          quran.salat);

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
  app.get('/search', search.toc, events.search, gallery.search, search.json);
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

  app.get('/salat', salat.index);
  app.get('/salat/wahshat', quran.getverses('inna',2,155,1),
                          quran.getverses('fatiha',1,0,7),
                          quran.getverses('kursi',2,254,1), 
                          quran.getverses('qadr',97,0,5),
                          mw.render('salat/wahshat'));
  app.get('/salat/hilal', quran.getverses('hood',11,5,1), 
                          quran.getverses('fatiha',1,0,7),
                          quran.getverses('qadr',97,0,5),
                          quran.getverses('ikhlaas',112,0,4),
                          quran.getverses('yunus',10,106,1),
                          verses.get('ruyatihilal'),
                          mw.render('salat/hilal'));

  app.get('/salat/layl', 
                         quran.getverses('fatiha',1,0,7),
                         verses.get('qunootlayl'),
                         quran.getverses('ikhlaas',112,0,4),
                         quran.getverses('falaq',113,0,5),
                         quran.getverses('naas',114,0,6),
                         mw.render('salat/layl'));

  app.get('/salat/ghufayla', quran.getverses('fatiha',1,0,7),
                             verses.get('ghufayla'),
                             quran.getverses('yunus',21,86,2),
                             quran.getverses('anaam',6,58,1),
                             mw.render('salat/ghufayla'));

  app.get('/salat/jafartayyar', quran.getverses('fatiha',1,0,7),
                                verses.get('jafartayyardua'),
                                verses.get('jafartayyardua2'),
                                verses.get('jafartayyarsajda'),
                                quran.getverses('zilzaal',99,0),
                                quran.getverses('aadiyat',100,0),
                                quran.getverses('nasr',110,0),
                                quran.getverses('ikhlaas',112,0),
                                mw.render('salat/jafartayyar'));


  app.get('/salat/prophet', quran.getverses('qadr',97,0,5),
                            verses.get('prophetsalat'),
                            mw.render('salat/prophet'));

  app.get('/salat/eid', quran.getverses('shams',91,0),
                            quran.getverses('fatiha',1,0,7),
                            quran.getverses('aala',87,0),
                            verses.get('eidqunoot'),
                            mw.render('salat/eid'));

  app.get('/*', mw.notfound);

};
