"use strict";

var db = require('../model/duas');
var verses = require('./verses');
var ratings = require('./ratings');


var page = { 
              title: 'Ziyarats of Prophet Muhammad and his pure progeny - duas.mobi', 
              description: 'Ziyarat, Izne-Dukhool, Supplications on Prophet Muhammad and his progeny.',
              image: '//duas.mobi/img/icon-ziyarat.png'
           };

module.exports = function(app) {

  app.get('/ziyaraat', function(req,res) { 
    res.redirect('/ziyarat');
  });

  app.get('/ziyarat', function(req,res) {
    db.all('select * from toc where type = "ziyarat" order by collection', function(err,info) {
      res.render('ziyaraat/index', { ziyarats: info, page: page });
    });
  });

  app.get('/ziyaraat/entry', function(req,res) {
    res.render('ziyaraat/entry');
  });

  app.get('/ziyaraat/salwat', function(req,res) {
    res.render('ziyaraat/salwat');
  });

  app.get('/ziyarat/:name', function(req,res,next) {
    var name = req.params.name;
    res.locals(page);
    db.get('select * from toc where urlkey = "' + name + '"', function(err,info) {
      req.info = info;
      next(err);
    });
  },ratings.get,verses.render);
};
