$('#languageSettingsPage').on('pageinit', function(ev) {
  $('#arfontsize').on('change', function(ev) {
    var fsize = Math.floor($('#arfontsize').val(),0);
    console.log(fsize);
    $('.arabic').css({ 'font-size': fsize + 'px' });
    return false;
  });
});
