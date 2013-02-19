"use strict";

var db = require('../model/quran');
var util = require('util');

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

var quran = {

  chapter: function(req,res,next) {
    var chapter = req.params.chapter;
    db.get('select * from chapters where id=' + chapter , function(err, surat) {
      var page = Number(req.query.p) || 0;
      var offset = page*8 || 0;
      var query = 'select * from arabic where chapter=' + req.params.chapter + ' order by verse limit 10 offset ' + offset;

      if (offset + 8 > surat.ayas) {
        chapter += 1;
        page = 0;
      } else {
        page += 1;
      }

      if (err) {
        util.log(err);
        return next(err);
      }

      db.all(query,function(err,verses) {
        var link = util.format('/quran/%d?p=%d',chapter,page);
        if (err) {
          util.log(err);
          return next(err);
        }
        res.render('quran/chapter', { verses: verses,  next: link, digits:toArabDigits, surat: surat });
      });
    });
  },

  verse: function(req,res,next) {
    var query = 'select * from arabic where chapter=' + req.params.chapter + ' and verse='+req.params.verse;
    db.get(query, function(err,ayah) {
      var link = '/quran/' + req.params.chapter + '/' + (Number(req.params.verse) + 1); // FIXME
      if (err) {
        util.log(err);
        return next(err);
      }
      res.render('quran/verse', { verse: ayah,  next: link, digits:toArabDigits });
    });
  }
};

module.exports = quran;
