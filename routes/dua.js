"use strict";

var db = require('../model/db');

var langmap = {
  'english': 'English Translation',
  'engtrans': 'English Transliteration',
  'urdu': 'Urdu Translation',
  'hindi': 'Hindi Translation',
  'arabiconly' : 'Arabic only',
  'hindionly' : 'Hindi only'
};

module.exports = function(app) {

  app.get('/duas', function(req,res) {
    db.all('select * from toc where type = "dua" and collection = "Sahifa-e-Sajjadiya"', function(err,rows) {
      if (err) {
        console.log(err);
        next(err);
      }
      res.render('duas', { data: rows });
    });
  });

  app.get('/dua/:name', function(req,res,next) {
    var lang = req.query.lang || 'english';
    var langdesc = langmap[lang];
    db.get('select * from toc where urlkey = "' + req.params.name + '" ', function(err,info) {
      if (err) {
        return next(err);
      }
      db.all('select * from ' + req.params.name, function(err,rows) {
        var page = { title : info.enname + ' with ' + langdesc};
        page.description = info.collection + ' - ' + info.endesc + ' by Imam Zainul Abideen with ' + langdesc;
        if (!rows[0][lang]) {
          rows[0][lang] = langdesc + ' Coming Soon ...';
        }
        res.render('dua', { data: rows, info: info, page: page, lang: lang , langdesc: langdesc});
      });
    });
  });

  app.get('/naat/:name', function(req,res,next) {
    var lang = 'urdu';
    var langdesc = 'Urdu Translation';
    db.get('select * from toc where urlkey = "' + req.params.name + '" ', function(err,info) {
      if (err) {
        return next(err);
      }
      db.all('select * from ' + req.params.name, function(err,rows) {
        var page = { title : info.enname + ' with ' + langdesc};
        page.description = info.collection + ' - ' + info.endesc + ' by Imam Zainul Abideen with ' + langdesc;
        res.render('naat', { data: rows, info: info, page: page, lang: lang , langdesc: langdesc});
      });
    });

  });

  app.get('/munajat', function(req,res) {
    db.all('select * from toc where type = "munajat"', function(err,rows) {
      res.render('munajats', { prayers: rows });
    });
  });

  app.get('/munajat/:prayer', function(req,res) {
    db.get('select * from toc where urlkey = "' + req.params.prayer + '" ', function(err,info) {
      var lang = req.query.lang || 'english';
      var langdesc = langmap[lang];
      if (err) {
        return next(err);
      }
      db.all('select * from ' + req.params.prayer, function(err,rows) {
        var page = { title : info.enname + ' with ' + langdesc};
        page.description = info.collection + ' - ' + info.enname + ' by Imam Zainul Abideen with ' + langdesc;
        if (!rows[0][lang]) {
          rows[0][lang] = 'Coming Soon ...';
        }
        res.render('munajat', { data: rows, info: info, lang: lang, page: page, langdesc: langdesc });
      });
    });
  });


};
