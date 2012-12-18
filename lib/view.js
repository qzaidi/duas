"use strict";

var config = {};

module.exports = function(app) {

  // globally available variables
  var locals = { 
                  title: 'Duas.org',
                  environment: app.settings.env,
                  pretty: (app.settings.env != 'production'),
                  app: {
                    manifest: 'imam.appcache'
                  }
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
