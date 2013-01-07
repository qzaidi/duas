(function(exports) {

  var method;
  var hijri = {

    keydates : {
    "1-1": "moharram",
    "1-2": "karbala-arrival",
    "2-13": "sakina",
    "2-17": "imamreza",
    "2-20": "arbaeen",
    "2-24": "zainab-martyrdom",
    "2-28": "prophet-imamhasan",
    "3-8": "imam-askari-martyrdom"
    },

    getHijriDate: function() {
      var months = [
        "Muharram",
        "Safar",
        "Rabi Al Awwal",
        "Rabi Al Thani",
        "Jamada Al Awwal",
        "Jamada Al Thani",
        "Rajab",
        "Sha'ban",
        "Ramadan",
        "Shawwal",
        "Dhul Qa'dah",
        "Dhul Hijjah"
      ];

      var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];

      var curdate = new Date();
      var curdate1 = new Date();

      curdate1.setTime(curdate.getTime() + (3600 * 4));

      hday=curdate1.getDate();
      _zyr=curdate1.getFullYear();
      _zm=curdate1.getMonth()+1;
      _zy=_zyr;
      zday=curdate1.getDay();


      if ((_zy>1582)||((_zy==1582)&&(_zm>10))||((_zy==1582)&&(_zm==10)&&(hday>14)))
      {

        _zjd=parseInt((1461*(_zy + 4800 + parseInt( (_zm-14) /12) ))/4) + parseInt((367*(_zm-2-12*(parseInt((_zm-14)/12))))/12)-parseInt((3*parseInt(( (_zy+4900+parseInt((_zm-14)/12))/100)))/4)+hday-32075;
      }
      else
      {
        _zjd = 367*_zy-parseInt((7*(_zy+5001+parseInt((_zm-9)/7)))/4)+parseInt((275*_zm)/9)+hday+1729777;
      }

      _zl=_zjd-1948440+10632;
      _zn=parseInt((_zl-1)/10631);
      _zl=_zl-10631*_zn+354;
      _zj=(parseInt((10985-_zl)/5316))*(parseInt((50*_zl)/17719))+(parseInt(_zl/5670))*(parseInt((43*_zl)/15238));
      _zl=_zl-(parseInt((30-_zj)/15))*(parseInt((17719*_zj)/50))-(parseInt(_zj/16))*(parseInt((15238*_zj)/43))+29;
      _zm=parseInt((24*_zl)/709);
      hday=_zl-parseInt((709*_zm)/24);
      _zy=30*_zn+_zj-30;


      _bulan = months[_zm - 1];
      _hari = days[zday];

      return {
        day: hday,
        month: _zm,
        year: _zy,
        monthName: _bulan
      };
    }
  };

  for (method in hijri) {
    exports[method] = hijri[method];
  }

}(typeof exports === 'undefined' ? this.hijri = {} : exports));
