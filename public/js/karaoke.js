var cues;

$(document).on('pageinit','.versePage',function() {
  (function() {
    $(window).scroll(function() {
      if($(this).scrollTop() > 150) {
        $('#toTop').fadeIn();    
      } else {
        $('#toTop').fadeOut();
      }
    });

    if ($('.span_1_of_2').css('width') == '48%') {
      $('.colswitch').val('on').slider('refresh')
    }

    $('.colswitch').on('change',function(e) { 
      var state = $(this).val();
      if (state == 'off') {
        $('.col').css('float','none')
        $('.span_1_of_2').css('width','100%');
      } else {
        $('.col').css('float','right')
        $('.span_1_of_2').css('width','48%');
      }
    });

    $('#toTop').click(function() {
      $('body,html').animate({scrollTop:0},800);
    });    
  }());
  
  $('.raty').raty({ 
    score: function() {
      return $(this).attr('data-score');
    }, 
    path: '/img' ,
    click: function(score, evt) {
      $.post('/rating?u='+document.location.pathname,"star="+score);
    }
  });

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
      text = $(this).parent().parent().find('.arabic');

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
      $(this).on('timeupdate', timeupdate);
    }
  });

  if (!cues || cues.length ==0 ) {
    cues = [];
    $('.versePage').keypress(function(ev) {
      if (ev.charCode == 120) {
        cues.push(Math.floor($('audio')[0].currentTime));
      } 
    });
  }
});

$(document).on('pageshow','.suratPage',function() {
  var el = $('a.highlight');
  if (el && el.length) {
    setTimeout(function() {$.mobile.silentScroll(el.offset().top)},200);
  }
});
