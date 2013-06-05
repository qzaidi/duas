"use strict";

var ramadhan = require('./ramadhan');

module.exports = function(app) {
  app.get('/ramadhan/daily/:day', ramadhan.daily);
};
