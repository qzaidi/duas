$(document).on('pageinit','#menuPage',function() {
  var d = hijri.getHijriDate();
  var keydates = hijri.keydates;
  if (link = (keydates[d.month + '-' + d.day] || keydates[d.month + '-' + (d.day + 1)] || keydates[d.month + '-' + (d.day + 2)])) {
    $('.calendar .day').html('<a href="/events/' + link + '">'+ d.day + '*</a>');
  } else {
    $('.calendar .day').text(d.day);
  }
  $('.calendar .month').text(d.monthName);
});

function relativeTime(time,now) {
  var next = new Date(now.getTime());
  var hm = time.split(':')
  var isfuture;
  var rh,rm;
  var str = ' in ';

  next.setHours(hm[0]);
  next.setMinutes(hm[1]);

  seconds = (next.getTime() - now.getTime())/1000;
  if (seconds > 0) {
    rh = (seconds/3600)|0;
    rm = (seconds - rh*3600)/60
    if (rh) {
      str += rh + ' hours ';
    }
    str += rm + ' minutes.'
    return str;
  }

  return '';
}

$(document).on('pageinit','#prayerTimesPage', function(ev) {
  function render(latlong) {
    var latitude = latlong.coords.latitude;
    var longitude = latlong.coords.longitude;

    if (latitude && longitude) {
      $.post('/prayertimes/savepos', latlong.coords, null,'json');
    }

    var date = new Date();
    var times = prayTimes.getTimes(date, [latitude, longitude]);
    var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    var iftar;
    var table;

    for(var i = 0; i < list.length; i++)  {
      var key = list[i].toLowerCase();
      document.getElementById('label_'+i).innerHTML = list[i];
      document.getElementById('delay_'+ i).innerHTML = relativeTime(times[key],date);
      document.getElementById('time_'+i).innerHTML = times[key];
    }

    hd = hijri.getHijriDate()
    gd = new Date()

    if (hd.month == 8 && hd.day > 26 || hd.month == 9 ) {
      table = '<table><tr><th>Date</th><th>Sehar</th><th>Iftar</th></tr>';

      for (var i = 1; i < 33; i++) {
        date = new Date(gd.getTime() + i*86400000);
        times = prayTimes.getTimes(date, [latitude, longitude]);
        iftar = times.maghrib.split(':').map(function(k,i) { return (i==1)?Number(k) + 10:k; }).join(':');
        
        table += '<tr><td>' + date.toLocaleDateString() + '</td><td>' + times.imsak + '</td><td>' + iftar + '</td></tr>';
      }
      table += '</table>';

      document.getElementById('iftartable').innerHTML = table;
    }

    $.ajax('http://api.geonames.org/findNearbyPlaceNameJSON?lat=' + latitude + '&lng=' + longitude + '&username=qasim', 
      { 
        success: function(res) { 
          var geo;
          if (res && res.geonames && res.geonames.length) {
            geo = res.geonames[0];
            document.getElementById('location').innerHTML = geo.name + ',' + geo.countryName;
          }
        }
      });
  }

  if (Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition(render);
  }
})
