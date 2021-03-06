"use strict";

//var db = require('../model/quran');
var util = require('util');
var qurandb = require('quran');
var db = require('../model/duas');
var helpers = require('./helpers');
var topics = require('./quran-topics')


var langmap = {
  'en': 'with English Translation',
  'ur': 'with Urdu Translation',
  'hi': 'with Hindi Translation',
  'ar' : 'Arabic text',
};


function getPNum(verse) {
 var npp = 8;
 return  ((verse - 1)/npp)|0;
}

function getnextlink(chapterInfo, currentChapter,currentVerse) {
  var vnum = Number(currentVerse) + 1;
  var cnum = currentChapter;

  // handle chapter endings
  if (vnum > chapterInfo.ayas) {
    vnum = 1;
    cnum++;
    if (cnum > 114) {
      return "/dua/quran";
    }
  }

  var link = '/quran/' + cnum + '/' + vnum;
  return link;
}

function getlink(page,npp, surat,lang) {
  var chapter = Number(surat.id);
  var pnum = page;
  var link = { cur: '/quran/' + chapter + '?p=' + page };
  if ((page + 1)*npp > surat.ayas) {
    chapter += 1;
    pnum = 0;
  } else {
    pnum += 1;
  }

  if (chapter > 0 && chapter < 115) {
    link.next = util.format('/quran/%d?p=%d&lang=%s',chapter,pnum,lang);
  }

  pnum = page;
  chapter = Number(surat.id);

  if (page == 0 && chapter > 0) {
    chapter -= 1;
    pnum = 999;
  } else {
    pnum -= 1;
  }

  if (chapter > 0 && chapter < 115) {
    link.prev = util.format('/quran/%d?p=%d&lang=%s',chapter,pnum,lang);
  }

  return link;
}

function leadZeroes(num,lead) {
  return new Array(lead+1 - String(num).length).join('0') + String(num) ;
}

var page = {
  title: 'The Holy Quran',
  description: 'Al-Quran, the book of Allah, with english translation',
  image: '//duas.mobi/img/icon-quran.png',
  author: 'Al-Quran'
};

var quran = {
  
  digits: helpers.digits,

  home: function(req,res) {
    res.render('quran/home', { page: page });
  },

  index: function(req,res,next) {
    qurandb.chapter(function(err,suras) {
      res.render('quran/index', { suras: suras , page: page });
    });
  },

  hadith: function(req,res,next) {
    var id = Math.min(req.params.id,40);
    db.get('select * from ahadith where rowid = ' + id, function(err,row) {
      req.data = { hadith: row, id: id };
      next();
    });
  },

  juz: function(req,res,next) {
    var npp = 8;
    
    qurandb.juz(function(err,ajza) {
      if (err) {
        return next(err);
      }

      ajza.forEach(function(juzInfo) {
        var pnum,hl;
        pnum = ((juzInfo.ayah - 1)/npp)|0;
        hl = (juzInfo.ayah - (pnum*npp) + 7)%8;
        juzInfo.href = '/quran/'+juzInfo.surah+'?p=' + pnum + '&hl=' + hl;
      });

      res.render('quran/juzindex',{ ajza: ajza.slice(1,31) });
    });
  },

  // dir, from a to z
  topicdir: function(req,res,next) {
    var alpha = Object.keys(topics.byalphabet).map(function(x) {
      return x.toUpperCase()
    })
    res.render('quran/topic/topic', { topics: alpha, link: function(x,idx) {
      return '/quran/topics/' + x.toLowerCase();
    },
    text: function(x,idx) {
      return x
    },
    title: "Topic Index"
    });
  },

  // quran/topics/i
  topics: function(req,res,next) {
    var alpha = req.params.alpha;
    res.render('quran/topic/topic', { topics: topics.byalphabet[alpha] , 
    link: function(x,idx) {
      return '/quran/topic/' + idx;
    },
    text: function(x,idx) {
      return topics.data[idx][0]
    },
    title: alpha.toUpperCase()
    });
  },

  topic: function(req,res,next) {
    var topic = req.params.topic
    var data = topics.data[topic]
    var ayats = data.slice(1)
    res.render('quran/topic/topic', { topics: ayats, title: data[0] , link: function(x,idx) {
      return '/quran/' + x.split(':').join('/');
    },
    text: function(x,idx) {
      return x
    }});
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
    var npp = 8;
    var hl = req.query.hl;
    var offset = pnum*npp || 0;
    var bismillah = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

    if (pnum*npp >= surat.ayas) {
      pnum = ((surat.ayas-1)/8)|0;
      offset = pnum*npp || 0;
    }

    qurandb.select({ chapter: req.params.chapter } , { limit : npp , offset: offset, language: lang }, function(err,verses) {
      var link;
      var partial;

      if (err) {
        util.log(err);
        return next(err);
      }

      link = getlink(pnum,npp,surat,lang);

      if (hl) {
        link.cur += '&hl=' + hl;
      }

      req.data = { verses: verses, prev: link.prev, url: link.cur,  next: link.next, digits:helpers.digits, surat: surat, lang: lang };

      // if we are starting a surah, add bismillah
      if (pnum == 0 && verses[0].verse == 1 && verses[0].chapter != 1) {
        partial = verses[0].ar.replace(bismillah,'');
        if (partial.length < verses[0].ar.length) {
          var v = { verse: 0, chapter: verses[0].chapter, ar: bismillah };
          verses[0].ar = partial;
          req.data.verses.unshift(v);
        }
      }

      if (hl) {
        verses[hl%npp].class = 'highlight';
      }

      req.data.page = { 
        title: surat.tname + ' - The Holy Quran',
        description: surat.tname + ' verse ' + verses[0].verse + ' to ' + (verses[0].verse + verses.length)   
                     + '  - Al-Quran, the book of Allah, ' + langmap[lang],
        image: '//duas.mobi/img/icon-quran.png',
        author: 'Al-Quran'
      };

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
    var option = req.dbopts || { language: req.query.lang || 'en' };


    if (req.params.verse) {
      filter.verse = req.params.verse;
    }

    // /quran/21/107-109 syntax
    if (req.params.v2) {
      option.limit = (req.params.v2 - req.params.verse + 1) | 0;
      option.offset = filter.verse - 1;
      filter.verse = undefined;
    } else if (req.query.ctx) {
      option.limit = 3;
      option.offset = filter.verse - 2;
      filter.verse = undefined;
    }

    if (!req.params.chapter && !req.params.verse) {
      return next();
    }

    console.log("xxx",option)

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
    var link = getnextlink(req.chapterInfo,req.params.chapter,req.params.verse);
    var pnum = getPNum(req.params.verse);
    var audio = 'http://www.everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/' +
              leadZeroes(req.params.chapter,3) + leadZeroes(req.params.verse,3) + '.mp3';

    page.title = req.chapterInfo.tname + ':' + req.ayah.verse + ' - Holy Quran';
    page.description = 'Surat ' + req.chapterInfo.tname + ' (' + req.chapterInfo.arname + ' ) verse '  + req.params.verse + ' - Holy Quran ';
    page.skipLangControls = true;

    res.render('quran/verse', { verse: req.params.verse, 
                                ayah: req.ayah, 
                                chapter: req.chapterInfo, 
                                next: link, 
                                helpers: helpers,
                                page: page, 
                                audio: audio,
                                lang: req.query.lang || 'en',
                                verses: req.verses,
                                ctx: '/quran/' + req.chapterInfo.id + '?p=' + pnum + '&hl=' + (req.params.verse - 1)
                              });
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
                                 verse: ayah.verse, digits: helpers.digits, id: id, page: page , enhtml: enhtml, arhtml:arhtml,
                                 urhtml: urhtml });
  },

  getverses: function(key,chapter,offset,limit) {
    return function(req,res,next) {
      if (!req.data) {
        req.data = {};
      }

      var options = { offset: offset, language: 'en' };

      if (limit) {
        options.limit = limit;
      }

      qurandb.select({ chapter: chapter } , options, function(err,verses) {
        req.data[key] = verses;
        next();
      });
    };
  },

  salat: function(req,res,next) {
    res.render('quran/salat',req.data);
  },

  search : function(req,res,next) {
    qurandb.search('en',req.search.term, function(err,rows) {
      var results = req.search.results;
      if (err) {
        console.log('error in quran search ' + err);
      }

      if (err || rows.length == 0 || req.query.sc != 'quran') {
        return next()
      }

      qurandb.chapter(null, function(err,chapters) {
        rows.forEach(function(x) {
          var desc = (x.en.length > 80)?x.en.substring(0,77) + '...':x.en
          results.push({ 
            title: x.chapter + ':' + x.verse + ' - ' + chapters[x.chapter].arname, 
            type: 'quran',
            description: chapters[x.chapter].tname + ' - ' + desc,
            href: '/quran/' + x.chapter + '/' + x.verse
          });
        });
        next();
      });
    })
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
