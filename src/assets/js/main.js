(function($, root) {
  // $ === jQuery
  // root === window
  // helps with minifying js + memory

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
