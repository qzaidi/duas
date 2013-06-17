var cues;

$(document).on('pageinit','#versePage',function() {

  (function() {
    $(window).scroll(function() {
      if($(this).scrollTop() > 150) {
        $('#toTop').fadeIn();    
      } else {
        $('#toTop').fadeOut();
      }
    });

    $('#toTop').click(function() {
      $('body,html').animate({scrollTop:0},800);
    });    
  }());
  
  $('audio').on('loadstart',function() {
    var i = 0; // remembers
    var trigger = 0;
    function timeupdate() {
      var curTime = $(this)[0].currentTime;
      var text,focus;

      if (curTime < trigger) return;

      for (i; i < cues.length; i++) {
        if (curTime < cues[i]) break;
      }

      trigger = cues[i];
      text = $('.arabic');
      

      if (i > 0) {
        text.eq(i-1).removeClass('highlight');
      }
      focus = text.eq(i);

      focus.addClass('highlight');
      if (i % 4 == 0) {
        $.mobile.silentScroll(focus.offset().top);
      }

      if ( i == cues.length) {
        i = 0;
        trigger = 0;
      }
    }

    if (cues && cues.length) {
      console.log('this page has cues');
      $(this).on('timeupdate', timeupdate);
    }
  });

  if (!cues || cues.length ==0 ) {
    cues = [];
    console.log('installing handler - press x to record a cue');
    $('#versePage').keypress(function(ev) {
      if (ev.charCode == 120) {
        cues.push(Math.floor($('audio')[0].currentTime));
      } 
    });
  }
});
