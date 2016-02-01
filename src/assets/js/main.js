(function($, root) {
  // $ === jQuery
  // root === window
  // helps protect global scope, minifying, and memory management

  $(function() {

    // Let's keep it strict
    'use strict';

    console.log('main.js');

    // prevent window bounce - ios fix
    $(root).on('touchmove', function(event) {
      event.preventDefault();
    });

  });

})(jQuery, this);
