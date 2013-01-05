function closePopup() {
  $('#popupInfo').popup("close");
}
if (document.cookie.indexOf('mobipopup') == -1) {
  setTimeout(function() {
    $('#popupInfo').popup();
    $('#popupInfo').popup("open", { positionTo: "origin" });
    _gaq.push(["_trackEvent","popup", 'mobile','',0,true]);
    setTimeout(closePopup,30000);
  },2000);
}
