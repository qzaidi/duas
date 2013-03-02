function syncFontSize() {
  var cursize = $('#arfontsizecur').val();
  var cssize = $('.arabic').css('font-size');
  if (cssize != cursize) {
    $('.arabic').css({ 'font-size': cursize + 'px' });
  }
}


$(document).on('pageinit', function(ev) {

  syncFontSize();

  $('#arfontsize').on('change', function(ev) {
    var fsize = Math.floor($('#arfontsize').val(),0);
    $('#arfontsizecur').val(fsize);
    syncFontSize();
    return false;
  });

  $('#setlanguage').on('click', function(ev) {
    ev.preventDefault();
    $('#langsettings').submit();
    return false;
  });

  $('#resetlanguage').on('click', function(ev) {
    ev.preventDefault();
    $('#arfontsize').val(28);
    $('#langsettings').submit();
    return false;
  });

  $('#setquran').on('click', function(ev) {
    ev.preventDefault();
    $('#quransettings').submit();
    return false;
  });

});
