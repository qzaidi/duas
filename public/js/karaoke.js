var cues;
$(document).on('pageinit',function() {
  console.log('inside pageinit');
  $('audio').on('loadstart',function() {
    var i = 0; // remembers
    var trigger = 0;
    function timeupdate() {
      var curTime = $(this)[0].currentTime;
      var text;

      if (curTime < trigger) return;

      for (i; i < cues.length; i++) {
        if (curTime < cues[i]) break;
      }

      trigger = cues[i];
      text = $('.arabic');

      if (i > 0) {
        text.eq(i-1).removeClass('highlight');
      }
      text.eq(i).addClass('highlight');

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
});
