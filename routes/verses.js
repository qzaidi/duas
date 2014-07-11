"use strict";

var db = require('../model/duas');

var langmap = {
  'english': 'English Translation',
  'engtrans': 'English Transliteration',
  'urdu': 'Urdu Translation',
  'hindi': 'Hindi Translation',
  'arabiconly' : 'Arabic only',
  'hindionly' : 'Hindi only',
  'hintrans' : 'Hindi Transliteration'
};

var verses = {
  collection: function(type) {
    return function(req,res,next) {
      var name = req.params.name;
      var title = type[0].toUpperCase() + type.substr(1)

      db.all('select * from toc where type = "' + type + '" and collection = "' + name + '"', function(err,rows) {
        var page;

        if (err) {
          console.log(err);
          return next(err);
        }

        page = { title: type + 's from ' + name, description: rows.length + 'Supplications/Munajats/Ziyarats tagged in ' + name };
        res.render('collection/collection' , { title: title, data: rows, page: page, collection: rows[0].collection });
      });
    };
  },

  render: function(req,res,next) {
    db.all('select * from ' + req.params.name, function(err,rows) {
      var lang = req.query.lang || 'english';
      var langdesc = langmap[lang];
      var info = req.info;
      var page = { title : info.enname + ' with ' + langdesc, image: '//duas.mobi/img/icon-' + info.type + '.png'};
      var duration, min,sec,ptm;

      if (info.arname) {
        page.title += ' - ' + info.arname;
      }
      page.description = info.collection + ' - ' + info.endesc + ' with ' + langdesc;
      if (info.audio) {
        page.description += ' and mp3 audio';
      }
      if (!rows[0][lang]) {
        rows[0][lang] = langdesc + ' Coming Soon ...';
      }

      if (duration = rows[rows.length - 1].cue) {
        min = (duration/60)|0;
        sec = duration - min*60;
        ptm = 'PT' + min + 'M' + sec + 'S'
        console.log(req.url + ' playtime ' + ptm);
      }

      if (info.link) {
        try {
          info.link = JSON.parse(info.link);
        } catch(e) {
          console.error('Failed to parse link for ' + req.params.name , info.link);
        }
      }
      res.render('verses', { data: rows, info: info, page: page, lang: lang , langdesc: langdesc, 
                             rating: req.rating|0, votes: req.votes|0, duration: ptm});
    });
  }
};

module.exports = verses;
