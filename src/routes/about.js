"use strict";

var about = {

  index: function(req,res,next) {
    res.render('about/index');
  },

  page: function(req,res,next) {
    res.render('about/' + req.params.page);
  }

};

module.exports = about;
