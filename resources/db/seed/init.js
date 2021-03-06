#!/usr/bin/env node
"use strict";

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var util = require('util');

function readFile(file,cb) {
  fs.readFile(file, function(err,data) {
    var lines = data.toString().split('\n');
    var rows = [];
    lines.forEach(function(line) {
      var m;

      if (line.length < 1) {
        return;
      }

      m = line.match(/^[0-9A-Za-z, ;:!\[\]."\(\)-?'—]+/);
      if (m) {
        rows.push([ m[0], line.substring(m[0].length) ]);
      } else {
        console.log('failed on ' + line);
        console.log(m);
        process.exit(1);
      }
    });

    cb(rows);
  });
}

function printdb(db) {
  var table = process.argv[1];
  db.each("SELECT * FROM " + table, function(err, row) {
    if (!err) {
      console.log(row);
    } else { 
      console.log(err);
    }
  });
}

function initdb(rows) {
  var db = new sqlite3.Database('duas');
  var table = process.argv[2];
  db.serialize(function() {
    db.run("CREATE TABLE " + table + " (english TEXT,arabic TEXT)",function(err) {
      if (!err) {
        var stmt = db.prepare("INSERT INTO " + table + " VALUES (?,?)");

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
  process.argv.shift();
  if (process.argv.length < 3) {
    console.log(util.format('Usage: %s <fileondisk> <table>',process.argv[0]));
    process.exit(1);
  }

  console.log('going to load ' + process.argv[1] + ' to table ' + process.argv[2]);

  readFile(process.argv[1],initdb);
}());


