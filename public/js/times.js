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

$(document).on('pageinit','#prayerTimesPage', function(ev) {
  function render(latlong) {
    var latitude = latlong.coords.latitude;
    var longitude = latlong.coords.longitude;

    var date = new Date();
    var times = prayTimes.getTimes(date, [latitude, longitude]);
    var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];
    var iftar;
    var table;

    for(var i = 0; i < list.length; i++)  {
      document.getElementById('label_'+i).innerHTML = list[i];
      document.getElementById('time_'+i).innerHTML = times[list[i].toLowerCase()];
    }

    table = '<table><tr><th>Date</th><th>Sehar</th><th>Iftar</th></tr>';

    for (var i = 1; i < 30; i++) {
      date = new Date(2014,06,i);
      times = prayTimes.getTimes(date, [latitude, longitude]);
      iftar = times.maghrib.split(':').map(function(k,i) { return (i==1)?Number(k) + 10:k; }).join(':');
      
      table += '<tr><td>' + date.toLocaleDateString() + '</td><td>' + times.imsak + '</td><td>' + iftar + '</td></tr>';
    }
    table += '</table>';

    //document.getElementById('iftartable').innerHTML = table;

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
