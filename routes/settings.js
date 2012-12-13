"use strict";

var settings = {
  index: function(req,res,next) {
    res.render('settings');
  }
};

module.exports = settings;
