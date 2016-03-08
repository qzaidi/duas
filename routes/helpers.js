"use strict";

var arabdigits = [ '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧',  '٨','٩' ];

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
  },

  setLanguage: function(url,val) {
    var newurl = url.replace(/lang=[^&]*/,'lang='+val)
    if (newurl.indexOf('?') == -1) {
      newurl += '?lang=' + val;
    }
    console.log(newurl);
    return newurl;
  },


  digits: function(num) {
    var anum = '', len;
    num = num.toString();
    var i;
    for (i = 0, len = num.length; i < len; i++) {
      anum += arabdigits[num[i]];
    }
    return anum;
  },

  interval: function(data,idx) {
    if (data.length-1 == idx) {
      return false
    }
    return (data[idx+1].cue - data[idx].cue)*1000
  },

  Oneof: function(data1,data2) {
    return data1 || data2 
  }




};

module.exports = helpers;
