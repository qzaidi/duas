"use strict";

var home = {

  checkForSpecialOccasion: function(req,res,next) {
    req.scripts = {};
    // set the text for popupinfo here
    // add popup.js to req.scripts.js array
    // TODO: support both external scripts and inline scripts
    
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
    
    res.render('index', {
      hijri: req.hijri,
      scripts: req.scripts,
      verse: req.verseofday,
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
