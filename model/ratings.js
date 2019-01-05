"use strict";

var firebaseApp = require('./firebaseApp')

//var db = level(__dirname + '/../data/ratings', { valueEncoding: 'json' });
var db = firebaseApp.database().ref('ratings')

var current = {};

function transform(key) {
  if (key[0] == '/') {
    key = key.substring(1)
  }

  return key.replace('/',':')
}

var ratings = {

  // keys are strings
  
  get: function(lkey,cb) {
    var key = transform(lkey)
    db.child(key).once('value',function(snapshot) {
      var value = snapshot.val()
      if(value == null) {
        value = { sum: 0, count: 0 };
        return callback(null,value)
      }

      cb(undefined,value);
    },cb);
  },

  set: function(lkey,val,cb) {
    var key = transform(lkey)
    if (current[key] != undefined) {
      current[key].push([val,cb]);
      console.log('skipping ' + val);
    } else {
      return this.setImmediate(key,val,cb);
    }
  },

  setImmediate: function(key,val,cb) {
    current[key] = [];
    this.get(key, function(err,res) {
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
      db.child(key).set(res,function(err,r) {
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

    ratings.get('ziyarat/ashura', function(e,r) { 
      console.log('initial : ' , r);
      ratings.set('ziyarat/ashura',5,console.log)
    });
  }

}());
