"use strict";

var hijri = require('../lib/hijri');

var middleware = {
  error: function(err,req,res,next) {
    console.log(err.message);
    res.status(err.status || 500).render('error', { err: err});
  },

  notfound: function(req,res,next) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  },

  hijri: function(req,res,next) {
    req.hijri = hijri.getHijriDate();
    next();
  },

  render: function(page) {
    return function(req,res,next) {
      res.render(page,req.data);
    };
  },

};

module.exports = middleware;
