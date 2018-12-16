"use strict";

var express = require('express');
var basicAuth = require('express-basic-auth');
var db = require('../../model/duas');

var munajat = require('./munajat');
var duas = require('./duas');
var ziyarat = require('./ziyarat');


var auth = basicAuth({ users: { 'admin':'hell0World' } });

module.exports = function(app) {

  app.get('/admin', function(req,res) {
    res.redirect('/admin/toc');
  });

  require('./table')(app,db,auth,'toc');
  require('./table')(app,db,auth,'events');
  require('./table')(app,db,auth,'gallery');
  require('./table')(app,db,auth,'treatise');
  require('./table')(app,db,auth,'qunoot');
  require('./table')(app,db,auth,'quotes');
  require('./table')(app,db,auth,'asmaulhusna');
  require('./table')(app,db,auth,'collection_map');
  require('./table')(app,db,auth,'covers');

  app.get('/admin/munajat/:name', auth, munajat.index);
  app.post('/admin/munajat/:name/list', auth, munajat.list);
  app.post('/admin/munajat/:name/create', munajat.create);
  app.post('/admin/munajat/:name/delete', munajat.remove);
  app.post('/admin/munajat/:name/update', munajat.update);

  app.get('/admin/dua/:name', auth, duas.index);
  app.post('/admin/dua/:name/list', auth, duas.list);
  app.post('/admin/dua/:name/update', auth, duas.update);

  app.post('/admin/ziyarat/:name/create', auth, ziyarat.create);
  app.get('/admin/ziyarat/:name', auth, ziyarat.index);
  app.post('/admin/ziyarat/:name/list', auth, ziyarat.list);
  app.post('/admin/ziyarat/:name/update', auth, ziyarat.update);

  app.post('/admin/cues/:name', duas.cues);
};
