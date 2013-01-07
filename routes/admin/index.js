"use strict";

var express = require('express');

var toc = require('./toc');
var munajat = require('./munajat');
var duas = require('./duas');
var ziyarat = require('./ziyarat');
var auth = express.basicAuth('admin','hell0World');


module.exports = function(app) {

  app.get('/admin/', auth, toc.index);
  app.post('/admin/toc/list', auth, toc.list);
  app.post('/admin/toc/create', auth, toc.create);
  app.post('/admin/toc/delete', auth, toc.remove);
  app.post('/admin/toc/update', auth, toc.update);

  app.get('/admin/munajat/:name', auth, munajat.index);
  app.post('/admin/munajat/:name/list', auth, munajat.list);
  app.post('/admin/munajat/:name/create', munajat.create);
  app.post('/admin/munajat/:name/delete', munajat.remove);
  app.post('/admin/munajat/:name/update', munajat.update);

  app.get('/admin/dua/:name', auth, duas.index);
  app.post('/admin/dua/:name/list', auth, duas.list);

  app.get('/admin/ziyarat/:name', auth, ziyarat.index);
  app.post('/admin/ziyarat/:name/list', auth, ziyarat.list);
  app.post('/admin/ziyarat/:name/update', auth, ziyarat.update);
};
