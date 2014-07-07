"use strict";

var db = require('../model/ratings');

var ratings = {

  get: function(req,res,next) {
    var url = req.query.u || req.path;
    db.get(url, function(e,r) {
      if (r.count == 0) {
        r.count = 1;
      }
      req.rating=(r.sum/r.count);
      next();
    });
  },

  render: function(req,res,next) {
    res.send(req.rating + '');
  },

  set: function(req,res,next) {
    var url = req.query.u;
    var rating = Number(req.body.star);

    console.log('rating url ',url, rating);

    if (!url || rating < 1 || rating > 5) {
      return res.status(400).end();
    }

    db.set(url,rating, function(e,r) {
      res.send(r.sum/r.count + '');
    });
  }

};

module.exports = ratings;
