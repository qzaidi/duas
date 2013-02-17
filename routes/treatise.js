"use strict";

var db = require('../model/duas');

var treatise = {

  index: function(req,res,next) {
    res.render('treatise');
  },

  list: function(req,res,next) {
    db.all('select * from treatise', function(err,rights) {
      var page = {};

      if (err) {
        util.log(err);
        return next(err);
      }

      page.title =  'Resalutul Huquq, by Imam Zainul Abideen';
      page.description = 'Treatise of rights, Magna Carta of Islam, by Imam Zainul Abideen';
      page.image = '//' + req.headers.host +'/img/icon-rights.png';

      res.render('rights/list', { rights: rights , page:page });
    });
  },

  right: function(req,res,next) {
    var id = Number(req.params.right);
    db.get('select * from treatise where id=' + id, function(err,info) {
      var page;
      var link = (id < 51) ? info.id + 1: undefined;
      if (err) {
        return next(err);
      }
      page = { 
               title: info.enname, 
               description: info.enname + ' - Treatise of Rights by Imam Zainul Abideen (AS)',
               image: '//' + req.headers.host + '/img/icon-rights.png'
             };
      res.render('rights/index' , { info: info , next: link , page: page });
    });
    
  }
};

module.exports = treatise;
