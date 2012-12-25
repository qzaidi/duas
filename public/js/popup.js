setTimeout(function() {
  console.log('inside popup');
  $('#popupInfo').popup();
  $('#popupInfo').popup("open", { positionTo: "origin" });
  setTimeout(function() {
    $('#popupInfo').popup("close");
  },10000);
},2000);
