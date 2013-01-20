"use strict";


var home = {

  checkForSpecialOccasion: function(req,res,next) {
    req.scripts = {};
    // set the text for popupinfo here
    // add popup.js to req.scripts.js array
    // TODO: support both external scripts and inline scripts
    
    next();
  },

  index: function(req,res,next) {
    var ua = req.headers['user-agent'];
    
    if(/like Mac OS X/.test(ua)) {
      req.scripts = {
        css: '/css/add2home.css',
        js: '/js/add2home.js'
      };
    } 
    
    /* Don't show popup on desktop
    else if (/Mobi/.test(ua) == false) {
        // desktop browser, run script
        if (!req.cookies.mobipopup) {
          req.scripts.js = '/js/popup.js';
          console.log('Going to serve popup');
          res.cookie('mobipopup', '1', { maxAge: 90000000, httpOnly: true })
        }
    }
    */

    res.render('index', {
      hijri: req.hijri,
      scripts: req.scripts
    });
  }

};

module.exports = home;
