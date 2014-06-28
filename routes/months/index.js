"use strict";

var ramadhan = require('./ramadhan');

module.exports = function(app) {
  app.get('/ramadhan/daily/:day', ramadhan.daily);
  app.get('/ramadhan/daily', ramadhan.dayindex);
  app.get('/duas/ramadhan', ramadhan.index);
};
