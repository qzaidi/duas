"use strict";

var toc = require('./toc');
var munajat = require('./munajat');

module.exports = function(app) {

  app.get('/admin/toc', toc.index);
  app.post('/admin/toc/list', toc.list);
  app.post('/admin/toc/create', toc.create);
  app.post('/admin/toc/delete', toc.remove);
  app.post('/admin/toc/update', toc.update);

  app.get('/admin/munajat/:name', munajat.index);
  app.post('/admin/munajat/:name/list', munajat.list);
  app.post('/admin/munajat/:name/create', munajat.create);
  app.post('/admin/munajat/:name/delete', munajat.remove);
  app.post('/admin/munajat/:name/update', munajat.update);
};
