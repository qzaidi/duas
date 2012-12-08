/*
    Author:
        Rahul Vagadiya (theunexpected1)
        http://rahulv.com
*/


var myScroll;
$(document).ready(function(){
    
    
   
   $(window).bind("resize", function(){
        //alert("resized");
            $('ul.menu').removeClass('on');
            $('.square img, .company').removeClass('on');
            
        if (($('.ui-page-active.iscroll').length >0) || ($('.ui-page-active .iscroll').length>0)){
            var scrollContainer;
            
            if ($('.ui-page-active.iscroll').length > 0){
                scrollContainer = $('.ui-page-active.iscroll')
            } else{
                scrollContainer = $('.ui-page-active .iscroll')
            }
            
            
            if (!$(scrollContainer).is(':visible')){
                return;
            }
            
            
            /*
            if (($(scrollContainer).hasClass('doneIScroll'))){
                return;
            }
            $(scrollContainer).addClass('doneIScroll');
            */
            
            
            var totalWidth = 0;
            $(".section", scrollContainer).each(function(){
                
               var square = $(this).find('.square');
               $(square).width($(square).height());
               $(this).css('padding-right', $(square).css('margin-bottom') );
               $('img', square).addClass('on');
               
               //if its a company tile
               if ($(this).find('.company').length){
                    var nextPadding= $(this).parent().next().find('.square:first').css('margin-bottom');
                    $(this).css('padding-right', nextPadding);
                    
                    totalWidth += $(this).find('img').width() + $(this).outerWidth();
                } else{
                    totalWidth += $(this).outerWidth()+5;
                }
            });
            
            console.log(totalWidth);
            $('.menu', scrollContainer).css({    
                'width' : totalWidth
            });            
            
            $('.company', scrollContainer).css({
                'height': $('.menu', scrollContainer).height()
            });
            
            $('.ui-page-active .menu').css('left', parseInt($('.ui-page-active .company img').width()) + parseInt($('.ui-page-active .menu .square:first').css('margin-bottom')));
            
            //$('ul.menu', scrollContainer).addClass('on');
            //$('.square img, #menuPage .company').addClass('on');
            
            
            var companyWidth = parseInt($('.company img', scrollContainer).outerWidth()) || 0;
            $('.scroller', scrollContainer).css({
                'width' : parseInt($('.menu', scrollContainer).outerWidth()) + parseInt($('.menu', scrollContainer).css('padding-right')) +  companyWidth
            });
            
            try{
                myScroll.destroy();
            } catch(e){
                
            }
            



            //if windows
            if (AppUtility.mobile.detectWindowsPhone()){
               if (!$('.windowsBG').length){
                  $(scrollContainer).prepend('<div class="windowsBG" style="position:fixed;width:100%;height:100%;background:#000;left:0;top:0;z-index:-1;"></div>');
               }
            } else{
               
               var scrollerID = $(scrollContainer).attr("id");
               
               myScroll = new iScroll(scrollerID, {
                   momentum: true,
                   hScroll: true,
                   vScroll: true,
                   hScrollbar: false,
                   vScrollbar: false,
                   onScrollMove: function () {
                       $(scrollContainer).addClass("dragging");
                       $('a', scrollContainer).each(function(){
                           var href = $(this).attr('href');
                           if (href.length > 0){
                               $(this).attr('data-href', href);
                               $(this).attr('href', '');
                           }
                           if (!AppUtility.mobile.detect()){
                               if ($('a', scrollContainer).hasClass('gallery-item')){
                                   $('a.gallery-item', scrollContainer).unbind().click(function() {return false;}).removeClass('photoswiped');
                               }
                           }
                           
                       })
                   
                       
                   },
                   onScrollEnd: function () {
                       $(scrollContainer).removeClass("dragging");
                       setTimeout(function(){
                           $('a', scrollContainer).each(function(){
                               var href = $(this).attr('data-href');
                               $(this).attr('href', href);
                           });
                           if (!AppUtility.mobile.detect()){
                               if ($('a', scrollContainer).hasClass('gallery-item')){
                                   $('a.gallery-item', scrollContainer).addClass('photoswiped').photoSwipe();
                               }
                           }
                           
                       }, 50);
                   }
               });
               
            }
            
            
            $('ul.menu', scrollContainer).addClass('on');
            $('.company', scrollContainer).addClass('on');
            
            setTimeout(function(){
                
                $('.company', scrollContainer).css({
                    'height': $('.menu', scrollContainer).height()
                });
                
            }, 100);
            
            
        
            
            
           }
        //end if
   
       });
       //end window resize binding
       
       
    
   /*
    window.ondeviceorientation = function(event) {
        //var a = event.alpha;
        var b = event.beta;
        var g = event.gamma;
        g *=-1;
        
        $('.menu .square').css({
            'transform': 'skewY(' + parseInt(g/10) + 'deg)',
            '-webkit-transform': 'skewY(' + parseInt(g/10) + 'deg)',
            '-moz-transform': 'skewY(' + parseInt(g/10) + 'deg)'
            
        })
    }
   */
    
    /*
    $(window).scroll(function(e){
        var scrollValue = $(window).scrollLeft() + 100;
        $('.menu').css({
            'transform-origin': scrollValue + 'px center',
           '-webkit-transform-origin': scrollValue + 'px center',
           '-moz-transform-origin': scrollValue + 'px center'
       });  
    })
    */
});

var windowLoaded = false;

var App = {
    init: function(){
        
        if (windowLoaded){
            $(window).trigger("resize");
        }
        
        $(window).load(function(){
            windowLoaded = true;
            $(window).trigger("resize");
        });
      
      
        //initialize flexsliders
        $('.flexslider').each(function(){
            if ($(this).find('li').length>1){
                
                $(this).not('.slidered').addClass('slidered').flexslider({
                    animation: "slide",
                    controlNav: true
                });
            }
        });
        
        
        //initiate photoswipe
        try{
        var options = {};
            $('a.gallery-item:not(.photoswiped)').addClass('photoswiped').photoSwipe(options);
        } catch(e){
            
        }
        
        
        $('.toggleMapHeight:not(.clickBound)').addClass('clickBound').click(function(e){
            e.preventDefault();
            
            if ($(this).hasClass('opened')){
                console.log("here");
                $('.map').empty().removeClass('large');
                $(this).removeClass('opened').removeClass('notransform');
            } else{
                $('.map').empty().addClass('large');
                $(this).addClass('opened')
            }
            
            var btn = $(this);

            setTimeout(function(){
                App.refreshMaps();  
                //$(btn).text($(btn).attr('data-opened')).addClass('notransform');
            }, 700);
        })
        
        this.Forms.bind();
        this.refreshMaps();
        
    },
    
    
    
    
    refreshMaps: function(){
         
         $('.map').each(function(){
              var me = $(this);
              var locationTitle = $(this).attr('data-location');
              var myId = $(me).attr('id');
              var geocoder = new google.maps.Geocoder();
              geocoder.geocode({
                   address: locationTitle
               }, function(locResult) {
                   var latVal = locResult[0].geometry.location.lat();
                   var longVal = locResult[0].geometry.location.lng();
                   App.initializeMap(myId, locationTitle, latVal, longVal);
               });
         });
    },
    
    
    initializeMap: function(locationVal, titleVal, latVal, longVal) {
               var latlng = new google.maps.LatLng(latVal, longVal);
               var settings = {
                       zoom: 13,
                       center: latlng,
                       mapTypeControl: false,
                       mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
                       navigationControl: false,
                       navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
                       streetViewControl: false,
                       zoomControl: true,
                       mapTypeId: google.maps.MapTypeId.ROADMAP 
               };
               var map = new google.maps.Map(document.getElementById(locationVal), settings);
               
               
               var nibrasPos= new google.maps.LatLng(latVal, longVal);
               var nibrasMarker = new google.maps.Marker({
                         position: nibrasPos,
                         map: map,
                         title:titleVal
               });
                 
         
     },
     
     
     
     
            
            Forms: {
               bind: function() {
                  // Add required class to inputs
                  $(':input[required]').addClass('required');
                  
                  // Block submit if there are invalid classes found
                  $('form:not(.html5enhanced)').addClass("html5enhanced").submit(function() {
                        var formEl = this;
                          $('input,textarea').each(function() {
                                  App.Forms.validate(this);
                          });
                          
                          if(($(this).find(".invalid").length) == 0){
                                  // Delete all placeholder text
                                  $('input,textarea').each(function() {
                                          if($(this).val() == $(this).attr('placeholder')) $(this).val('');
                                  });
                                  
                                  //now submit form via ajax
                                  $.ajax({
                                    url: $(formEl).attr("action"),
                                    type: $(formEl).attr("method"),
                                    data: $(formEl).serialize(),
                                    success: function(r) {
                                       $(".successMessage").slideDown('fast');
                                       $('html,body').stop().animate({
                                          scrollTop: $(".successMessage").offset().top - 30
                                       }, 300);
                                       
                                       $(formEl).find('input[type="text"], input[type="email"], input[type="tel"], select').val('');
                                       $(formEl).find('textarea').val('');
                                       setTimeout(function(){
                                          $(".successMessage").slideUp('fast');
                                       }, 4000);
                                    }
                                  })
                                  return false;
                          }else{
                                  return false;
                          }
                  });
         
               },
               is_email: function(value){
                 return (/^([a-z0-9])(([-a-z0-9._])*([a-z0-9]))*\@([a-z0-9])(([a-z0-9-])*([a-z0-9]))+(\.([a-z0-9])([-a-z0-9_-])?([a-z0-9])+)+$/).test(value);
               },
               is_url: function(value){
                       return (/^(http|https|ftp):\/\/([A-Z0-9][A-Z0-9_-]*(?:\.[A-Z0-9][A-Z0-9_-]*)+):?(\d+)?\/?/i).test(value);
               },
               is_number: function(value){
                       return (typeof(value) === 'number' || typeof(value) === 'string') && value !== '' && !isNaN(value);
               },
               validate: function(element) {
                  var $$ = $(element);
                  var validator = element.getAttribute('type'); // Using pure javascript because jQuery always returns text in none HTML5 browsers
                  var valid = true;
                  var apply_class_to = $$;
                  
                  var required = element.getAttribute('required') == null ? false : true;
                  switch(validator){
                          case 'email': valid = App.Forms.is_email($$.val()); break;
                          case 'url': valid = App.Forms.is_url($$.val()); break;
                          case 'number': valid = App.Forms.is_number($$.val()); break;
                  }
                  
                  // Extra required validation
                  if(valid && required && $$.val().replace($$.attr('placeholder'), '') == ''){
                          valid = false;
                  }
                  
                  // Set input to valid of invalid
                  if(valid || (!required && $$.val() == '')){
                          apply_class_to.removeClass('invalid');
                          apply_class_to.addClass('valid');
                          return true;
                  }else{
                          apply_class_to.removeClass('valid');
                          apply_class_to.addClass('invalid');
                          return false;
                  }
               }
            }
           
     
     
};
    
    $(document).ready(function(){
        
    });

    var pageChange = function(){
        App.init();
        //alert("pc");
        //App.init();
    }
    
    $(document).bind('pagechange', pageChange);
        
        $('div').live('pagehide', function (event, ui) { 
        var page = jQuery(event.target);
    
        if (page.attr('data-cache') == 'never') { 
            page.remove(); 
        }; 
    });
        
    
    
    