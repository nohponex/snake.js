/**
 * HTML5 Canvas snake window.snake.game
 * game
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */

define(function(require) {
  var util = {
    /**
     * Check if string is url encoded
     * @param {string} str
     * @returns {boolean}
     */
    isEncoded: function(str) {
      return decodeURIComponent(str) !== str;
    },
    /**
     * Get url variables
     * @returns {Array}
     */
    getUrlVars: function() {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(m, key, value) {
          vars[key] = value;
        });
      return vars;
    }
  };

  return util;
});
