function syncFontSize() {
  var langmap = { 
    'ar': 'arabic', 
    'ur': 'urdu',
    'hi': 'hindi' 
  };

  Object.keys(langmap)
        .forEach(function(lang) {
           var cursize = $('#' + lang + 'fontsizecur').val();
           var cssize = $('.' + langmap[lang]).css('font-size');
           if (cssize != cursize) {
             $('.' + langmap[lang]).css({ 'font-size': cursize + 'px' });
           }
        });
}

function setfontcontrol(lang) {
  $('#' + lang + 'fontsize').on('change', function(ev) {
    var fsize = $('#' + lang + 'fontsize').val()|0;
    $('#' + lang + 'fontsizecur').val(fsize);
    syncFontSize();
    return false;
  });
}

function changeFont(lang,dir) {
  var langmap = { 
    'ar': 'arabic', 
    'ur': 'urdu',
    'hi': 'hindi' 
  };
  var fsize = parseInt($('.' + langmap[lang]).css('font-size'));
  if (dir == '+') {
      $('#' + lang + 'fontsizecur').val(fsize+1);
  } else if (dir ==  '-' ) {
      $('#' + lang + 'fontsizecur').val(fsize-1);
  }
  syncFontSize()
}

$(document).on('pageinit', function(ev) {
  syncFontSize();
});

$(document).on('pageinit','#languageSettingsPage', function(ev) {

  setfontcontrol('ar');
  setfontcontrol('ur');
  setfontcontrol('hi');

  $('#setlanguage').on('click', function(ev) {
    ev.preventDefault();
    $('#langsettings').submit();
    return false;
  });

  $('#resetlanguage').on('click', function(ev) {
    ev.preventDefault();
    $('#arfontsize').val(28);
    $('#urfontsize').val(18);
    $('#hifontsize').val(18);
    syncFontSize();
    $('#langsettings').submit();
    return false;
  });

});

$(document).on('pageinit','#quranSettingsPage', function(ev) {
  $('#setquran').on('click', function(ev) {
    ev.preventDefault();
    $('#quransettings').submit();
    return false;
  });
});
