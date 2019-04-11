"use strict";

var db = require('../model/duas');
var quran = require('./quran');
var ratings = require('./ratings');
var verses = require('./verses');

function validateMunajat(req,res,next) {
  db.get('select * from toc where urlkey = "' + req.params.name + '" ', function(err,info) {
    if (!err && !info) {
      err = new Error('Not Found');
      err.status = 404;
    }
    req.info = info;
    next(err);
  });
}

function validateDua(req,res,next) {
  db.get('select * from toc where urlkey = "' + req.params.name.toLowerCase() + '" ', function(err,info) {
    if (!info) {
      err = new Error('Not Found');
      err.status = 404;
    }
    req.info = info;
    next(err);
  });
}


module.exports = function(app) {

  app.get('/random/dua', function(req,res) {
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

  app.get('/dua', quran.getverses('pray',2,185,1),function(req,res,next) {
    db.all('select * from toc where type = "dua" and collection = "Sahifa-e-Sajjadiya"', function(err,rows) {
      var page = { title: 'Duas from Sahifa-e-Sajjadiya', 
                   description: 'Supplications from Sahifa-e-Sajjadiya, the Pslams of Islam by Imam Zainul Abideen' };
      if (err) {
        console.log(err);
        return next(err);
      }
      req.data.data = rows
      req.data.page = page;
      res.render('duas', req.data);
    });
  });

  
  function duasCollection(req,res,next) {
    db.all('select distinct(collection) from toc where type = "dua" order by collection', function(err,rows) {
      console.log(rows);
      var page = { title: 'Duas from Ahlul Bayt',
                   description: 'Supplications from the house of Prophet' };
      if (err) {
        console.log(err);
        return next(err);
      }
      res.render('collection/index' , { data: rows, page: page });
    });
  }

  app.get('/collections', duasCollection);
  app.get('/duas/collections', duasCollection);

  
  function duaFromCollection(req,res,next) {
    var name = req.params.name;
    db.all('select * from toc where type = "dua" and collection = "' + name + '"', function(err,rows) {
      var page;
      
      if (err) {
        console.log(err);
        return next(err);
      }

      if (rows.length == 0) {
        err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }


      page = { title: 'Duas from ' + name, description: rows.length + 'Supplications from ' + name };
      res.render('collection/collection' , { data: rows, page: page, collection: rows[0].collection, title: 'Supplications', url: '/duas/collection/'+name });
    });
  }

  app.get('/collection/:name',duaFromCollection);
  app.get('/duas/collection/:name',verses.collection('dua'));

  app.get('/duas', function(req,res,next) {
    res.redirect('/dua');
  });

  app.get('/dua/:name/slides', validateDua,ratings.get, verses.reveal);
  app.get('/amp/dua/:name', validateDua,ratings.get, verses.amp);
  app.get('/dua/:name', validateDua,ratings.get, verses.render);

  app.get('/sermon/:name', function(req,res,next) {
    db.get('select * from toc where urlkey = "' + req.params.name.toLowerCase() + '" ', function(err,info) {
      if (!info) {
        err = new Error('Not Found');
        err.status = 404;
      }
      req.info = info;
      next(err);
    });
  }, ratings.get, verses.render);

  app.get('/sermon', function(req,res,next) {
    db.all('select * from toc where type = "sermon"', function(err,rows) {
      var page = { title: 'Sermons from Ahlebait', 
                   description: 'Sermons from ahle-bait' };
      res.render('sermon', { prayers: rows, page: page });
    });
  });
  app.get('/sermons/collection/:name',verses.collection('sermon'));

  app.get('/munajat', function(req,res) {
    db.all('select * from toc where type = "munajat"', function(err,rows) {
      var page = { title: 'Munajat from Sahifa-e-Sajjadiya', 
                   description: 'Whispered Prayers from Sahifa-e-Sajjadiya, the Pslams of Islam by Imam Zainul Abideen' };
      res.render('munajats', { prayers: rows, page: page });
    });
  });

  app.get('/munajat/:name/slides',validateMunajat,ratings.get,verses.reveal);
  app.get('/munajat/:name',validateMunajat,ratings.get,verses.render);
  app.get('/amp/munajat/:name', validateMunajat,ratings.get, verses.amp);

  app.get('/munajats/collection/:name',verses.collection('munajat'));

};
