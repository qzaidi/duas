"use strict";

var menu = require('./menu');

var home = {

  checkForSpecialOccasion: function(req,res,next) {
    req.scripts = {};
    next();
  },

  index: function(req,res,next) {
    var ua = req.headers['user-agent'];
    
    if(/like Mac OS X/.test(ua)) {
      req.scripts = {
        css: '/css/add2home.css',
        js: '/js/add2home.js'
      };
    } 

    // hack for events
    menu[4].text = req.hijri.monthName;
    
    res.render('index', {
      hijri: req.hijri,
      scripts: req.scripts,
      verse: req.verseofday,
      menu: menu,
      url : "http://duas.mobi/",
    });
  },

  ramadhan: function(req,res,next) {
    res.render('ramadhan', {
      hijri: req.hijri,
      scripts: req.scripts,
      verse: req.verseofday,
      url : "http://duas.mobi/",
    });
  }
};

module.exports = home;
