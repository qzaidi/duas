"use strict";

module.exports = function(app) {
  app.get('/videos', function(req,res) {
    res.render('videos');
  });
};
