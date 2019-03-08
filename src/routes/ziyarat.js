"use strict";

var db = require('../model/duas');
var verses = require('./verses');
var ratings = require('./ratings');


var page = { 
              title: 'Ziyarats of Prophet Muhammad and his pure progeny - duas.mobi', 
              description: 'Ziyarat, Izne-Dukhool, Supplications on Prophet Muhammad and his progeny.',
              image: '//duas.mobi/img/icon-ziyarat.png'
           };

function validate(req,res,next) {
  var name = req.params.name;
  db.get('select * from toc where urlkey = "' + name + '"', function(err,info) {
    if (!err && !info) {
      err = new Error('Not Found');
      err.status = 404;
    }
    req.info = info;
    next(err);
  });
}

module.exports = function(app) {

  app.get('/ziyaraat', function(req,res) { 
    res.redirect('/ziyarat');
  });

  app.get('/ziyarat', function(req,res) {
    db.all('select * from toc where type = "ziyarat" order by collection', function(err,info) {
      var collections = {};

      if (!err) {
        info.forEach(function(ziyarat) {
          var c = collections[ziyarat.collection] || [];
          c.push(ziyarat);
          collections[ziyarat.collection] = c;
        });
      }
      res.render('ziyaraat/index', { ziyarats: info, page: page, collections: collections });
    });
  });

  app.get('/ziyarats/collection/:name', verses.collection('ziyarat'));

  app.get('/ziyaraat/entry', function(req,res) {
    res.render('ziyaraat/entry');
  });

  app.get('/ziyaraat/salwat', function(req,res) {
    res.render('ziyaraat/salwat');
  });

  app.get('/ziyarat/:name/slides',validate,ratings.get,verses.reveal);
  app.get('/ziyarat/:name', validate,ratings.get,verses.render);
  app.get('/amp/ziyarat/:name', validate,ratings.get, verses.amp);

};
