"use strict";

var dates = {
  page: function(req,res,next) {
    res.render('dates/' + req.params.page);
  }
};

module.exports = dates;
