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
  render: function(req,res,next) {
    db.all('select * from ' + req.params.name, function(err,rows) {
      var lang = req.query.lang || 'english';
      var langdesc = langmap[lang];
      var info = req.info;
      var page = { title : info.enname + ' with ' + langdesc};
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
      if (info.link) {
        try {
          info.link = JSON.parse(info.link);
        } catch(e) {
          console.error('Failed to parse link for ' + req.params.name , info.link);
        }
      }
      res.render('verses', { data: rows, info: info, page: page, lang: lang , langdesc: langdesc, rating: req.rating|0});
    });
  }
};

module.exports = verses;
