"use strict";

var db = require('../model/duas');
var quran = require('./quran');

var names = {

  index: function(req,res,next) {

   db.all('select rowid,* from asmaulhusna', function(err,rows) {
    if (err) {
      return next(err);
    }

    res.render('names/index', { names: rows });
   });
  },

  get: function(req,res,next) {
    var id = Number(req.params.id);
    var sql = 'select * from asmaulhusna where rowid = "' + id + '"';
    db.get(sql, function(err,row) {
      var verses;
      row.id = id;
      req.name = row;

      if (row.verse) {
        verses = row.verse.split(':');
        if (verses.length == 2) {
          req.params.chapter = verses[0];
          req.params.verse = verses[1];
        }
      }
      next();
    });
  },


  render: function(req,res,next) {
    req.name.ayah = req.ayah;
    req.name.digits = quran.digits;
    req.name.page = {
      title: req.name.engtrans + '-' + req.name.english,
      description: req.name.engtrans + ' - Asma-Ul-Husna, the beautiful names of Allah',
      image: '//duas.mobi/img/icon-allah.png',
    };
    res.render('names/asma',req.name);
  }

};

module.exports = names;
