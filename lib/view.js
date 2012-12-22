"use strict";

var config = {};

module.exports = function(app) {

  // globally available variables
  var locals = { 
                  page: {
                    title: 'Imam Sajjad',
                    image: 'http://ali.husain.in/apple-touch-icon-precomposed.png',
                    description: 'A web app dedicated to Imam Ali ibn-al Husain, great grandson of Prophet Muhammad (PBUH)'
                  },
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
    res.locals.url = 'http://' + req.host + req.url;
    next();
  });

};
