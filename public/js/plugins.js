
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


// place any jQuery/helper plugins in here, instead of separate, slower script files.
//
window.onerror = function(message,url,line) {
  _gaq.push([
    "_trackEvent",
    "JS Error",
    message,
    (url + " (" + line + ")"),
    0, true
  ]);
};

$('[data-role=page]').live('pageshow', function (event, ui) {
  try {
    _gaq.push(['_setAccount', 'UA-27791118-2']);
    hash = location.hash;
    if (hash) {
      _gaq.push(['_trackPageview', hash.substr(1)]);
    } else {
      _gaq.push(['_trackPageview']);
    }
  } catch(err) {

  }
});
