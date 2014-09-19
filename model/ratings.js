"use strict";

var level = require('level');
var db = level(__dirname + '/../data/ratings', { valueEncoding: 'json' });
var current = {};

var ratings = {

  // keys are strings
  
  get: function(key,cb) {
    db.get(key,function(err,res) {
      if (err) {
        res = { sum: 0, count: 0 };
      }
      console.log('fetched for ' + key);
      cb(undefined,res);
    });
  },

  set: function(key,val,cb) {
    if (current[key] != undefined) {
      current[key].push([val,cb]);
      console.log('skipping ' + val);
    } else {
      return this.setImmediate(key,val,cb);
    }
  },

  setImmediate: function(key,val,cb) {
    current[key] = [];
    db.get(key, function(err,res) {
      var pendingUpdates;
      if (err || !res) {
        res = { sum: 0, count: 0 };
      } 
      res.sum += val;
      res.count += 1;
      if (pendingUpdates = current[key]) {
        pendingUpdates.forEach(function(k) {
          res.sum += k[0];
          res.count += 1;
        });
        current[key] = undefined;
      }
      db.put(key,res,function(err,r) {
        cb(err,res);
        pendingUpdates.forEach(function(k) {
          if (k[1]) {
            k[1](err,res);
          }
        });
      });
    });
  }

};

module.exports = ratings;

(function() {

  if (require.main == module) {
    ratings.get('test', function(e,r) { 
      console.log('initial : ' , r);

      ratings.set('test', 4, function(e,r) { console.log(e|| r); });
      ratings.set('test', 5, function(e,r) { console.log(e|| r); });

      ratings.set('test', 4, function(e,r) { 
        ratings.get('test', function(e,r) { console.log('final: ', r); });
      });
    });
  }

}());
