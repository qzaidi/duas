"use strict";

var salat = {

  index: function(req,res,next) {
    res.render('salat/index');
  },

  page: function(req,res,next) {
    res.render('salat/' + req.params.page, req.data);
  }

};

module.exports = salat;
