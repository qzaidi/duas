"use strict";

var settings = {
  index: function(req,res,next) {
    res.render('settings/index');
  },

  page: function(req,res,next) {
    res.render('settings/' + req.params.page);
  }
};

module.exports = settings;
