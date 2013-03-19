$( document ).on( "pageinit", "#searchPage", function() {
  var lastqry = {};
  $( "#autocomplete" ).on("listviewbeforefilter", function ( e, data ) {
    var $ul = $( this ),
    $input = $( data.input ),
    value = $input.val(),
    html = "<li>Your query returned no results.</li>";
    $ul.html( "" );
    if ( value && value.length > 2 ) {
      $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
      $ul.listview( "refresh" );
      $.ajax({
        url: "/search",
        dataType: "jsonp",
        crossDomain: true,
        data: {
          q: $input.val()
        }
      })
      .then( function ( response ) {
        var type; 
        lastqry.term = value;
        lastqry.rcount = response.length;
        if (response.length) {
          html = '';
          $.each( response, function ( i, val ) {
            if (type != val.type) {
              type = val.type;
              html += '<li data-role=list-divider style="text-transform: capitalize;">' + type + '</li>';
            }
            html += "<li><a href='" + val.href + "'><h3>" + val.title + "</h3><p>" + val.description + "</p></a></li>";
          });
        } 
        $ul.html( html );
        $ul.listview( "refresh" );
        $ul.trigger( "updatelayout");
      });
    }
  });
});
