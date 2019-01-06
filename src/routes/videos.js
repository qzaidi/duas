"use strict";

module.exports = function(app) {
  app.get('/videos', function(req,res) {
    res.render('videos/index');
  });

  app.get('/videos/:page', function(req,res) {
    res.render('videos/' + req.params.page);
  });

};
