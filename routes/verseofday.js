"use strict";
var db = require('../model/duas');
var fdb = require('../model/firebase');

var vod = {

  verses: null,

  init: function(req,res,next) {
    if (vod.verses) {
      return next();
    }

    vod.verses = [];

    fdb.ref("covers").on("value",function(snapshot) {

      var firsttime = false;
      if (vod.verses.length == 0) {
        firsttime = true;
      } else {
        vod.verses = [];
      }

      snapshot.forEach(function(child) {
        vod.verses.push(child.val());
      });
      if (firsttime) {
        next();
      }
    }, function (err) {
      console.log("error in firebase",err)
      db.all('select * from covers', function(err,res) {
        vod.verses = res;
        next();
      });
    });

  },

  get: function(req,res,next) {
    var l = vod.verses.length;
    if (l == 0) {
      return next();
    }

    var candidates = vod.verses.filter(function(v) {
      return v.selected;
    }); 

    var selected = candidates.length?candidates[0]:vod.verses[0];

    req.verseofday = { };

    if (selected.arabic) {
      req.verseofday.arabic = selected.arabic;
    }

    if (selected.href) {
      req.verseofday.href = selected.href;
      req.verseofday.linkrel = selected.linkrel;
    }
    
    req.verseofday.background = selected.image || 'quranlight.jpg';
    req.verseofday.style = selected.style || '';
    req.verseofday.attrib = selected.attrib || '';

    next();
  }

};

module.exports = vod;
