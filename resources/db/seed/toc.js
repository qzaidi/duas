#!/usr/bin/env node
"use strict";

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var util = require('util');

function readFile(file,cb) {
  fs.readFile(file, function(err,data) {
    var lines = data.toString().split('\n');
    var rows = [];
    lines.pop();
    lines.forEach(function(line) {
      var fields = line.split('|');

      if (fields.length != 7) {
        console.log('invalid line ' + line + ' fields=' + fields.length);
        console.log(fields[4]);
        process.exit(2);
      }

      rows.push(fields);

    });

    cb(rows);
  });
}

function printdb(db) {
  var table = "toc";
  db.all("SELECT * FROM " + table, function(err, row) {
    if (!err) {
      console.log(row);
    } else { 
      console.log(err);
    }
  });
}

function initdb(rows) {
  var db = new sqlite3.Database('duas');
  var table = "toc";
  db.serialize(function() {
    db.run("CREATE TABLE " + table + " (urlkey TEXT,type TEXT, collection TEXT, audio TEXT, enname TEXT, arname TEXT, endesc TEXT)",function(err) {
      if (!err) {
        var stmt = db.prepare("INSERT INTO " + table + " VALUES (?,?,?,?,?,?,?)");

        rows.forEach(function(row) {
          stmt.run(row);
        });
        stmt.finalize();
      } else {
        console.log(err);
      }
      printdb(db);
    });


  });

}

(function main() {
  readFile("toc.psv",initdb);
}());


