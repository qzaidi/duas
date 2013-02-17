"use strict";

var sqlite3 = require('sqlite3').verbose();

var dbopts = {
  'r': sqlite3.OPEN_READONLY,
  'w': sqlite3.OPEN_READWRITE
};

module.exports = function(dbfile,opt) {
  var db;
  var options = dbopts[opt || 'r'];
  db = new sqlite3.Database(__dirname + '/../data/' + dbfile, options);

  db.insert = function(table,obj,cb) {
    var sql = 'insert into ' + table ;
    var keys = Object.keys(obj);
    var values = [];

    sql += '(' + keys.join(',') + ') ';

    keys.forEach(function(key) {
      values.push("'" + obj[key] + "' ");
    });

    sql += 'VALUES (' + values.join(',') + ');';
    console.log(sql);
    this.run(sql,cb);
  };

  db.update = function(table,obj,not_updates,cb) {
    var sql = 'update ' + table + ' set ';
    var updates = [];
    var filters = [];

    Object.keys(obj).forEach(function(key) {
      if (not_updates.indexOf(key) == -1) {
        updates.push(key + '="' + obj[key] + '"');
      }
    });

    sql += updates.join(',') + ' where ';
    not_updates.forEach(function(key) {
      filters.push(' ' + key + '="' + obj[key] + '"');
    });

    sql += filters.join(' and ');
    console.log(sql);
    this.run(sql,cb);
  };

  return db;

}
