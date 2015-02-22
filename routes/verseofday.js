"use strict";
var db = require('../model/duas');

var vod = {

  verses: null,

  init: function(req,res,next) {
    if (vod.verses) {
      return next();
    }

    db.all('select * from covers', function(err,res) {
      vod.verses = res;
      next();
    });
  },

  get: function(req,res,next) {
    var l = vod.verses.length;
    var selected = vod.verses.filter(function(v) {
      return v.selected;
    })[0];

    req.verseofday = { };

    if (selected.arabic) {
      req.verseofday.arabic = selected.arabic;
    }

    if (selected.href) {
      req.verseofday.href = selected.href;
    }
    
    req.verseofday.background = selected.image || 'quranlight.jpg';
    req.verseofday.style = selected.style || '';

    next();
  }

};

module.exports = vod;
