"use strict";

var middleware = {
  error: function(err,req,res,next) {
    res.status(err.status || 500).render('error', { err: err});
  },

  notfound: function(req,res,next) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
};

module.exports = middleware;
