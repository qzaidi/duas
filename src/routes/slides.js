"use strict";

var db = require('../model/duas');

var slides = {
  index: function(req,res,next) {
    db.all('select * from toc where cover != ""',function(err,rows) {
      res.render('slides/index', { slides: rows });
    });
  }
};

module.exports = slides;
