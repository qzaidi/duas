"use strict";

var db = require('../../model/db');

var events = {
  index: function(req,res,next) {
    res.render('admin/events');
  },

  list: function(req,res,next) {
    db.all('select * from events', function(err,rows) {
      var result = { "Result": "OK" };
      if (err) {
        console.log(err);
      } else {
        result.Records = rows;
      }
      res.json(result);
    });
  },

  create: function(req,res,next) {
    db.insert('events',req.body, function(err,data) {
      var result = { "Result" : "OK" };
      if (err) {
        result.RESULT = 'ERROR';
        result.message = err.message;
      } else {
        console.log(data);
        result.Record = req.body;
      }
      res.json(result);
    });
  },

  remove: function(req,res,next) {


  },

  update: function(req,res,next) {
    db.update("events", req.body, [ 'urlkey' ], function(err,data) {
      var result = { "Result": "OK" };
      if (err) {
        console.log(err);
        result.Result = 'ERROR';
        result.message = err.message;
      }
      res.json(result);
    });
  }

};

module.exports = events;
