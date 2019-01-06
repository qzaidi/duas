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
                    keywords: 'islam,quran,shia,muslim,dua,supplications,allah,muhammad,islamic prayers,ahlebait',
                    author: 'duas.mobi'
                  },
                  environment: app.settings.env,
                  pretty: (app.settings.env != 'production'),
                  app: {
                    manifest: 'imam.appcache'
                  },
                  titlecase: function(str) {
                   return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                  }
                };
  
  app.set('view engine', 'pug');

  app.locals = locals;

  app.locals.static_url = function(url) {
    return (config.cdn || '') + url;
  };

  app.use(function(req,res,next) {
    res.locals.session = req.session;
    res.locals.url = 'http://' + config.host + req.url;
    res.locals.host = 'http://' + config.host;
    res.locals.rpath = req.url;
    res.locals.settings = req.session.settings || config.settings;
    next();
  });

};
