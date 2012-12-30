(function() {

  var keydates = {
    "1-1": "moharram",
    "1-2": "karbala-arrival",
    "2-13": "sakina",
    "2-17": "imamreza",
    "2-20": "arbaeen",
    "2-24": "zainab-martyrdom",
    "2-28": "prophet-wafat",
    "3-8": "imam-askari-martyrdom"
  };
  var link;

  _b_01 = "Muharram";
  _b_02 = "Safar";
  _b_03 = "Rabi Al Awwal";
  _b_04 = "Rabi Al Thani";
  _b_05 = "Jamada Al Awwal";
  _b_06 = "Jamada Al Thani";
  _b_07 = "Rajab";
  _b_08 = "Sha'ban";
  _b_09 = "Ramadan";
  _b_10 = "Shawwal";
  _b_11 = "Dhul Qa'dah";
  _b_12 = "Dhul Hijjah";

  ///////// Days //////////
  _h_01 = "Sunday";     // Sunday
  _h_02 = "Monday"; // Monday
  _h_03 = "Tuesday";  // Tuesday
  _h_04 = "Wednesday";    // Wednesday
  _h_05 = "Thursday"; // Thursday
  _h_06 = "Friday"; // Friday
  _h_07 = "Saturday"; // Saturday

  var curdate = new Date();
  var curdate1 = new Date();

  curdate1.setTime(curdate.getTime() + (3600 * 4));



  _zd=curdate1.getDate();
  _zyr=curdate1.getFullYear();
  _zm=curdate1.getMonth()+1;
  _zy=_zyr;
  _zday=curdate1.getDay();


  if ((_zy>1582)||((_zy==1582)&&(_zm>10))||((_zy==1582)&&(_zm==10)&&(_zd>14)))
  {

    _zjd=parseInt((1461*(_zy + 4800 + parseInt( (_zm-14) /12) ))/4) + parseInt((367*(_zm-2-12*(parseInt((_zm-14)/12))))/12)-parseInt((3*parseInt(( (_zy+4900+parseInt((_zm-14)/12))/100)))/4)+_zd-32075;
  }
  else
  {
    _zjd = 367*_zy-parseInt((7*(_zy+5001+parseInt((_zm-9)/7)))/4)+parseInt((275*_zm)/9)+_zd+1729777;
  }

  _zl=_zjd-1948440+10632;
  _zn=parseInt((_zl-1)/10631);
  _zl=_zl-10631*_zn+354;
  _zj=(parseInt((10985-_zl)/5316))*(parseInt((50*_zl)/17719))+(parseInt(_zl/5670))*(parseInt((43*_zl)/15238));
  _zl=_zl-(parseInt((30-_zj)/15))*(parseInt((17719*_zj)/50))-(parseInt(_zj/16))*(parseInt((15238*_zj)/43))+29;
  _zm=parseInt((24*_zl)/709);
  _zd=_zl-parseInt((709*_zm)/24);
  _zy=30*_zn+_zj-30;



  if(_zm==1){ _bulan = _b_01;}
  if(_zm==2){ _bulan = _b_02;}
  if(_zm==3){ _bulan = _b_03;}
  if(_zm==4){ _bulan = _b_04;}
  if(_zm==5){ _bulan = _b_05;}
  if(_zm==6){ _bulan = _b_06;}
  if(_zm==7){ _bulan = _b_07;}
  if(_zm==8){ _bulan = _b_08;}
  if(_zm==9){ _bulan = _b_09;}
  if(_zm==10){ _bulan = _b_10;}
  if(_zm==11){ _bulan = _b_11;}
  if(_zm==12){ _bulan = _b_12;}

  if(_zday==0){ _hari = _h_01;}
  if(_zday==1){ _hari = _h_02;}
  if(_zday==2){ _hari = _h_03;}
  if(_zday==3){ _hari = _h_04;}
  if(_zday==4){ _hari = _h_05;}
  if(_zday==5){ _hari = _h_06;}
  if(_zday==6){ _hari = _h_07;}

  $('#menuPage').live('pageshow',function() {
    if (link = (keydates[_zm + '-' + _zd] || keydates[_zm + '-' + (_zd + 1)] || keydates[_zm + '-' + (_zd + 2)])) {
      $('.calendar .day').html('<a href="/events/' + link + '">'+ _zd + '*</a>');
    } else {
      $('.calendar .day').text(_zd);
    }

    $('.calendar .month').text(_bulan);
  });

}());
