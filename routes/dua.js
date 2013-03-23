"use strict";

var db = require('../model/duas');
var verses = require('./verses');

var langmap = {
  'english': 'English Translation',
  'engtrans': 'English Transliteration',
  'urdu': 'Urdu Translation',
  'hindi': 'Hindi Translation',
  'arabiconly' : 'Arabic only',
  'hindionly' : 'Hindi only'
};

module.exports = function(app) {

  app.get('/random', function(req,res) {
    var sql = 'select count(*) as total from toc';
    db.get(sql, function(err,c) {
      var total = c.total;
      var random = Math.floor(Math.random()*total);
      var sql = 'select urlkey,type from toc limit 1 offset ' + random;
      console.log(sql);
      db.get(sql, function(err,info) {
        console.log(err || info);
        res.redirect('/' + info.type + '/' + info.urlkey);
      });
    });
  });

  app.get('/duas', function(req,res,next) {
    db.all('select * from toc where type = "dua" and collection = "Sahifa-e-Sajjadiya"', function(err,rows) {
      var page = { title: 'Duas from Sahifa-e-Sajjadiya', 
                   description: 'Supplications from Sahifa-e-Sajjadiya, the Pslams of Islam by Imam Zainul Abideen' };
      if (err) {
        console.log(err);
        next(err);
      }
      res.render('duas', { data: rows , page: page});
    });
  });

  app.get('/dua/:name', function(req,res,next) {
    db.get('select * from toc where urlkey = "' + req.params.name + '" ', function(err,info) {
      req.info = info;
      next(err);
    });
  },verses.render);

  app.get('/naat/:name', function(req,res,next) {
    var lang = req.query.lang || 'english';
    var langdesc = langmap[lang];
    db.get('select * from toc where urlkey = "' + req.params.name + '" ', function(err,info) {
      if (err) {
        return next(err);
      }
      db.all('select * from ' + req.params.name, function(err,rows) {
        var page = { title : info.enname + ' with ' + langdesc};
        page.description = info.collection + ' - ' + info.endesc + ' by Imam Zainul Abideen with ' + langdesc;
        res.render('munajat', { data: rows, info: info, page: page, lang: lang , langdesc: langdesc});
      });
    });
  });

  app.get('/munajat', function(req,res) {
    db.all('select * from toc where type = "munajat"', function(err,rows) {
      var page = { title: 'Munajat from Sahifa-e-Sajjadiya', 
                   description: 'Whispered Prayers from Sahifa-e-Sajjadiya, the Pslams of Islam by Imam Zainul Abideen' };
      res.render('munajats', { prayers: rows, page: page });
    });
  });

  app.get('/munajat/:name', function(req,res,next) {
    db.get('select * from toc where urlkey = "' + req.params.name + '" ', function(err,info) {
      req.info = info;
      next(err);
    });
  },verses.render);


};
