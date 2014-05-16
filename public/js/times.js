$(document).on('pageinit','#prayerTimesPage', function(ev) {
  function render(latlong) {
    var latitude = latlong.coords.latitude;
    var longitude = latlong.coords.longitude;

    var date = new Date();
    var times = prayTimes.getTimes(date, [latitude, longitude]);
    var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];

    /*
    var html = '<table id="timetable">';
    html += '<tr><th colspan="2">'+ date.toLocaleDateString()+ '</th></tr>';
    */
    console.log(list);
    for(var i = 0; i < list.length; i++)  {
      document.getElementById('label_'+i).innerHTML = list[i];
      document.getElementById('time_'+i).innerHTML = times[list[i].toLowerCase()];
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
