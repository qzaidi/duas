"use strict";

var ramadhan = require('./ramadhan');
var mw = require('../mw');
var quran = require('../quran');


module.exports = function(app) {
  app.get('/ramadhan/daily/:day', ramadhan.daily);
  app.get('/ramadhan/daily', ramadhan.dayindex);
  app.get('/duas/ramadhan', ramadhan.index);
  app.get('/months/ramadhan/crescent',mw.render('months/ramadhan/crescent'))
  app.get('/months/ramadhan/duas',mw.render('months/ramadhan/duas'))
  app.get('/months/ramadhan/quran',quran.getverses('q1',2,184,1),mw.render('months/ramadhan/quran'))
  app.get('/months/ramadhan/qadr',mw.render('months/ramadhan/qadr'))
  app.get('/months/ramadhan/ziyarat',mw.render('months/ramadhan/ziyarat'))
  app.get('/months/ramadhan/salat',mw.render('months/ramadhan/salat'))
  app.get('/months/ramadhan/iftar',mw.render('months/ramadhan/iftar'))
  app.get('/months/ramadhan/farewell',mw.render('months/ramadhan/farewell'))

};
