#!/usr/bin/env node
"use strict";

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var util = require('util');

/* file format
 * arabic
 * blank
 * english
 * blank
 * the above repeats ...
 */
function readFile(file,cb) {
  fs.readFile(file, function(err,data) {
    var lines = data.toString().split('\n');
    var rows = [];
    var index = 0;
    var row = [];

    lines.forEach(function(line) {
      if (line.trim() == '') {
        //skip blanks
        return;
      }


      index++;
      switch (index) {
        case 1: 
          var x = line.split('-');
          row.push(Number(x[0]));
          row.push(x[1].trim());
          break;
        case 2:
          row.push(line);
          break;
        case 3:
          row.push(line);
          break;
        case 4: 
          row.push(line);
          console.log(row);
          rows.push(row);
          row = [];
          index = 0;
          break;
      }


    });

    //console.log(rows);
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
    db.run("CREATE TABLE " + table + " (id NUMBER, enname TEXT, english TEXT, arname TEXT, arabic TEXT)",function(err) {
      if (!err) {
        var stmt = db.prepare("INSERT INTO " + table + " VALUES (?,?,?,?,?)");

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
