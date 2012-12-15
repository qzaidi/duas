$(document).bind("mobileinit", function(){
  $.mobile.defaultPageTransition = 'fade';
  $.mobile.ignoreContentEnabled = true;
  $.mobile.page.prototype.options.domCache = false;
  //$.mobile.ajaxEnabled = false;
});
