"use strict";

var duasorg = {

  render: function(req,res,next) {
    res.render('months/duas/' + req.hijri.month);
  }

};

module.exports = duasorg;
