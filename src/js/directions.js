/**
 * HTML5 Canvas snake window.snake.game
 * directions
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */

define(function(require) {
  /**
   * Movement directions
   * @type {Object}
   */
  var directions = {
    left: [-1, 0],
    right: [+1, 0],
    up: [0, -1],
    down: [0, +1],
    /**
     * Get opposite direction
     * @param {Array} direction
     * @returns {Array} Returns opposite direction vector
     */
    opposite: function(direction) {
      if (direction === directions.left) {
        return directions.right;
      } else if (direction === directions.right) {
        return directions.left;
      } else if (direction === directions.up) {
        return directions.down;
      } else if (direction === directions.down) {
        return directions.up;
      }

      return [direction[0] * -1, direction[1] * -1];
    }
  };
  return directions;
});
