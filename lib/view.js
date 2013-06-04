"use strict";

var config = {
  settings: {
    language: {
      arfontsize: 28
    }
  },
  host: 'duas.mobi'
};

module.exports = function(app) {

  // globally available variables
  var locals = { 
                  page: {
                    title: 'duas.mobi',
                    image: 'http://duas.mobi/apple-touch-icon-precomposed.png',
                    description: 'Islamic Duas, Supplications, Prayers, Munajats, Hamd from the House of the Prophet (PBUH)',
                    author: 'duas.mobi'
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
    res.locals.url = 'http://' + config.host + req.url;
    res.locals.host = 'http://' + config.host;
    res.locals.settings = req.session.settings || config.settings;
    next();
  });

};
