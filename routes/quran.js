"use strict";

//var db = require('../model/quran');
var util = require('util');
var qurandb = require('quran');

var arabdigits = [ '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧',  '٨','٩' ];

function toArabDigits(num) {
  var anum = '';
  num = Number(num);
  while (num) {
   anum += arabdigits[num%10]; 
   num = Math.floor(num/10,0);
  }
  return anum;
}

function getlink(page,offset, surat) {
  var chapter = Number(surat.id);
  var link;
  if (offset + 8 > surat.ayas) {
    chapter += 1;
    page = 0;
  } else {
    page += 1;
  }
  if (chapter > 0 && chapter < 115) {
    link = util.format('/quran/%d?p=%d',chapter,page);
  }
  return link;
}

var page = {
  title: 'The Holy Quran',
  description: 'Al-Quran, the book of Allah, with english translation'
};

var quran = {

  index: function(req,res,next) {
    qurandb.chapter(function(err,suras) {
      res.render('quran/index', { suras: suras , page: page});
    });
  },

  chapter: function(req,res,next) {
    var chapter = Number(req.params.chapter);
    qurandb.chapter(chapter,function(err, rows) {
      var surat;
      var config = req.session.settings? req.session.settings.quran : { language: 'ar' };
      var lang = req.query.lang || config.language;
      var page = Number(req.query.p) || 0;
      var offset = page*8 || 0;

      if (err) {
        util.log(err);
        return next(err);
      }
      surat = rows[0];


      qurandb.select({ chapter: chapter } , { limit : 10 , offset: offset, language: lang }, function(err,verses) {
        var link;
        if (err) {
          util.log(err);
          return next(err);
        }

        link = getlink(page,offset,surat);
        req.data = { verses: verses,  next: link, digits:toArabDigits, surat: surat, lang: lang };
        next();
      });
    });
  },

  html : function(req,res,next) {
    res.render('quran/chapter', req.data);
  },

  json: function(req,res,next) {
    var data = req.data;
    var rows = req.data.map(function(verse) {
      return [ verse.chapter, verse.verse, verse.ar ];
    });
    res.json(rows);
  },

  api: function(req,res,next) {
    var chapter = req.params.chapter|1;
    qurandb.select(null, function(err,rows) {
      req.data = rows;
      next();
    });
  },

  verse: function(req,res,next) {
    var chapter = req.params.chapter|0;
    var verse = req.params.verse|0;

    qurandb.select({ chapter: chapter, verse: verse }, { language: 'en' } , function(err,rows) {
      var link = '/quran/' + req.params.chapter + '/' + (Number(req.params.verse) + 1);
      var ayah;
      if (err || rows.length == 0) {
        util.log(err);
        return next(err);
      }
      ayah = rows[0];
      res.render('quran/verse', { verse: req.params.verse, ayah: ayah, chapter: req.params.chapter, next: link, digits:toArabDigits });
    });
  }
};

module.exports = quran;

(function() {
  if (require.main == module) {
    console.log('fetching all verses');
      qurandb.select(null , function(err,verses) {
        console.log(err || verses);
      });
  }
}());
