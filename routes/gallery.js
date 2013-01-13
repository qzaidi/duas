"use strict";

var db = require('../model/db');

module.exports = function(app) {

  app.get('/gallery', function(req,res) {
    db.all('select * from gallery', function(err,rows) {
      var images = [];
      var subarray = [];
      if (err) { return next(err); }
      for (var i = 0; i < rows.length; i++) {
        subarray.push(rows[i]);
        if (i % 3 == 2) {
          images.push(subarray);
          subarray = [];
        }
      }
      if (subarray.length) { 
        images.push(subarray);
      }
      res.render('gallery', { rows: images });
    });
  });
};
