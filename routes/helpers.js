"use strict";

var helpers = {
  handleEllipsis: function(row) {
    if (row == '...') {
      return '<br/>'
    }
    return row;
  },

  embellish: function(row) {
    if (/\([0-9]*:[0-9-]*\)/.test(row)) {
      return row.replace(/\(([0-9]*:[0-9-]*)\)/g,function(verse,p1) {
        var link = '/quran/' + p1.replace(':','/');
        var res = "<a style='color:blue;' href='" + link + "'>" + verse + "</a>"; 
        return res;
      });
    }

    return row;
  }

};

module.exports = helpers;
