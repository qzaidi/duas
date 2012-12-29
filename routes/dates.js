"use strict";

var dates = {
  page: function(req,res,next) {
    var page = {};
    page.image = 'http:// ' + req.host + '/img/' + req.params.page + '.jpg' ;
    res.render('dates/' + req.params.page, { page: page });
  }
};

module.exports = dates;
