(function($){
  var el;
  var settings = {};

  var methods = {
    init: function(options) {
      el = this;

      settings = {
                   token: false,
                   query_param: 'q'
                 };

      if (options) {
        $.extend(settings, options);
      }

      if (!settings.token || settings.query_param == '') {
        return this;
      }

      $.getJSON(
        'http://tapirgo.com/api/1/search.json?token=' + settings.token + '&query=' + paramValue(settings.query_param) + '&callback=?', function(data){
          if(settings['complete']) { settings.complete() }

          if(jQuery.isEmptyObject(data)) {
            el.append('<div class="nothing-found"><h3>No result found. Please click on <a href="/">this link</a> to return to home page or use different search term(s).\
                       <br/>Thank you for visiting my blog <i class="fa fa-smile-o fa-lg" aria-hidden="true"></i><h3></div>');
          } else {
            el.append(data.length + ' Result(s) Found.<br/><br/>');
            $.each(data, function(key, val) {
              var str = '<div class="result"><h2 class="search-title"><a href="' + val.link + '">' + val.title + '</a></h2>';
              str += '<p class="search-link"><a href="' + val.link + '">' + val.link + '</a></p>';
              str += '<p class="search-summary">' + truncate(val.summary) + '</p>';
              str += '</div>';
              str += '<br/>';
              el.append(str);
            });
          }
        }
      );

      return this;
    }
  };

  function truncate(title) {
    var length = 100;
    if (title.length > length) {
       title = title.substring(0, length) + ' ...';
    }
    return title;
  }

  // Extract the param value from the URL.
  function paramValue(query_param) {
    var results = new RegExp('[\\?&]' + query_param + '=([^&#]*)').exec(window.location.href);
    return results ? results[1] : false;
  }

  $.fn.tapir = function(method) {
    if (methods[method]) {
      return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.tapir');
    }
  };

})(jQuery);