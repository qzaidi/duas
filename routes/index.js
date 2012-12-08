"use strict";


module.exports = function(app) {
  app.get('/', function(req,res) {
    res.render('index');
  });

  app.get('/about', function(req,res) {
    res.render('about');
  });

  app.get('/teachings', function(req,res) {
    res.render('teachings');
  });

  app.get('/praise', function(req,res) {
    res.render('praise');
  });

  app.get('/duas', function(req,res) {
    res.render('duas');
  });



  app.get('/munajat', function(req,res) {
    var prayers = [ 'Repenters', 'Complainers', 'Fearful', 'Hopeful', 'Beseechers', 'Thankful',
                    'Obedient towards God', 'Devotees', 'Lovers', 'seekers of mediation',
                    'Utterly Poor', 'Knowers', 'Rememberers', 'those who hold fast', 'Abstainers' ];
    res.render('munajat', { 
                            prayers: prayers, 
                            mapurl: function(x) {
                              var re = / /g;
                              return x.replace(re,'').toLowerCase()
                            }
                          });
  });

  app.get('/munajat/:prayer', function(req,res) {
    res.render('munajat/' + req.params.prayer);
  });

  require('./gallery')(app);
  require('./videos')(app);

};
