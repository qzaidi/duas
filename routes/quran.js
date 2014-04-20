"use strict";

//var db = require('../model/quran');
var util = require('util');
var qurandb = require('quran');
var db = require('../model/duas');

var arabdigits = [ '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧',  '٨','٩' ];

function toArabDigits(num) {
  var anum = '', len;
  num = num.toString();
  var i;
  for (i = 0, len = num.length; i < len; i++) {
    anum += arabdigits[num[i]];
  }
  return anum;
}

function getlink(page,offset, surat) {
  var chapter = Number(surat.id);
  var link;
  if (offset + 8 >= surat.ayas) {
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
  description: 'Al-Quran, the book of Allah, with english translation',
  image: '//duas.mobi/img/icon-quran.png',
  author: 'Al-Quran'
};

var quran = {
  
  digits: toArabDigits,

  home: function(req,res) {
    res.render('quran/home', { page: page });
  },

  index: function(req,res,next) {
    qurandb.chapter(function(err,suras) {
      res.render('quran/index', { suras: suras , page: page});
    });
  },

  chapterInfo: function(req,res,next) {
    var chapter = Number(req.params.chapter);
    qurandb.chapter(chapter,function(err, rows) {
      if (err) {
        util.log(err);
        return next(err);
      }

      req.chapterInfo = rows[0];
      next();
    });
  },


  chapter: function(req,res,next) {
    var surat = req.chapterInfo;
    var config = req.session.settings? req.session.settings.quran : { language: 'ar' };
    var lang = req.query.lang || config.language;
    var pnum = Number(req.query.p) || 0;
    var offset = pnum*8 || 0;

    qurandb.select({ chapter: req.params.chapter } , { limit : 10 , offset: offset, language: lang }, function(err,verses) {
      var link;
      if (err) {
        util.log(err);
        return next(err);
      }

      link = getlink(pnum,offset,surat);
      req.data = { verses: verses,  next: link, digits:toArabDigits, surat: surat, lang: lang, page: page };
      next();
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

  getverse: function(req,res,next) {
    var filter = { chapter: req.params.chapter };
    var option = req.dbopts || { language: 'en' };

    if (req.params.verse) {
      filter.verse = req.params.verse;
    }

    if (!req.params.chapter && !req.params.verse) {
      return next();
    }

    qurandb.select(filter, option , function(err,rows) {
      var ayah;
      if (err || rows.length == 0) {
        util.log(err);
        return next(err);
      }
      req.ayah = rows[0];
      req.verses = rows.slice(1);
      next();
    });
  },

  renderverse: function(req,res,next) {
    var link = '/quran/' + req.params.chapter + '/' + (Number(req.params.verse) + 1);
    res.render('quran/verse', { verse: req.params.verse, ayah: req.ayah, chapter: req.params.chapter, next: link, digits:toArabDigits , page: page});
  },

  qunoot: function(req,res,next) {
    var id = req.params.id|0;

    if (id == 0) { 
      id = 1;
    }

    req.id = id;

    db.get('select * from qunoot where rowid = ' + id, function(err,row) {

      if (err || !row) {
        // this is probably because we are at the end, so reset id
        util.log('error occured ' + err);
        return err?next(err):res.redirect('/qunoot/1');
      }

      req.params.chapter = row.chapter;
      req.dbopts = { offset: row.verse - 1, limit: row.numverses, language: [ 'en', 'ur' ] };

      req.description = row.description || '';

      next();
    });
  },

  random: function(req,res,next) {
    db.get('select count(*) as total from qunoot', function(err,row) {
      var total = row.total;
      var random = Math.random()*total|0 + 1;
      res.redirect('/qunoot/' + random);
    });
  },

  renderqunoot: function(req,res,next) {
    var breaks = { 'Our Lord': 0, 'My Lord': 0, 'say:' : 4, 'said:' : 5, ':': 1 };
    var arbreaks = { 'رَبَّنَا': 0, 'رَبِّ ': 0,'قُل': 3 };
    var urbreaks = {  
                     'پروردگار': 0,
                     'خدایا': 0,
                     'کہئے کہ':  7,
                     'کہ ': 3

                   };
    var ayah = req.ayah;
    var en = ayah.en;
    var ar = ayah.ar;
    var ur = ayah.ur;
    var pindex;
    var id = req.id;
    var enhtml = '',arhtml = '', urhtml = '';
    var page = { author: 'Al-Quran', description: req.description };

    page.title = req.chapterInfo.tname + ':' + ayah.verse + ' - Holy Quran';
    page.image = res.locals.host + '/img/icon-quran.png';

    if (Object.keys(arbreaks).some(function(bp) {
      var idx = ar.indexOf(bp);
      if (idx != -1) {
        pindex = idx + arbreaks[bp];
        return true;
      }
    })) {
      ayah.ar = [ ayah.ar.substring(0,pindex), ayah.ar.substring(pindex)].join('<em style="color:blue;">');
      arhtml = '</em>';
    }

    if (Object.keys(urbreaks).some(function(bp) {
      var idx = ur.indexOf(bp);
      if (idx != -1) {
        pindex = idx + urbreaks[bp];
        return true;
      }
    })) {
      ayah.ur = [ ayah.ur.substring(0,pindex), ayah.ur.substring(pindex)].join('<blockquote class="ur"><em>');
      urhtml = '</em></blockquote>';
    }


    if (Object.keys(breaks).some(function(bp) {
      var idx = en.indexOf(bp);
      if (idx != -1) {
        pindex = idx + breaks[bp];
        return true;
      }
    })) {
      ayah.en = [ ayah.en.substring(0,pindex-1), ayah.en.substring(pindex)].join('<blockquote><em>') ;
      enhtml = '</em></blockquote>';
    }

    res.render('quran/qunoot', { ayah: ayah, verses: req.verses, description: req.description, chapter: req.chapterInfo, 
                                 verse: ayah.verse, digits: toArabDigits, id: id, page: page , enhtml: enhtml, arhtml:arhtml,
                                 urhtml: urhtml });
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
