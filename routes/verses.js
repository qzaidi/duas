"use strict";

var db = require('../model/duas');

var langmap = {
  'english': 'English Translation',
  'engtrans': 'English Transliteration',
  'urdu': 'Urdu Translation',
  'hindi': 'Hindi Translation',
  'arabiconly' : 'Arabic only',
  'hindionly' : 'Hindi only'
};

var verses = {
  render: function(req,res,next) {
    db.all('select * from ' + req.params.name, function(err,rows) {
      var lang = req.query.lang || 'english';
      var langdesc = langmap[lang];
      var info = req.info;
      var page = { title : info.enname + ' with ' + langdesc};
      page.description = info.collection + ' - ' + info.endesc + ' with ' + langdesc;
      if (!rows[0][lang]) {
        rows[0][lang] = langdesc + ' Coming Soon ...';
      }
      res.render('verses', { data: rows, info: info, page: page, lang: lang , langdesc: langdesc});
    });
  }
};

module.exports = verses;