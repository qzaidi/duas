"use strict";

module.exports = function(app) {

  // globally available variables
  var locals = { 
                  title: 'Duas.org',
                  pretty: (app.settings.env != 'production')
                };
  
  app.set('view engine', 'jade');

  app.locals(locals);

  app.locals.static_url = function(url) {
    return (config.cdn || '') + url;
  };

  app.use(function(req,res,next) {
    res.locals.session = req.session;
    next();
  });

};
