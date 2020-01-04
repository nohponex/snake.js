/**
 * HTML5 Canvas snake game
 * TODO:
 * - add obstacles
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */

define(['directions'], function(directions) {
  /**
   * Snake object
   * @type {sss}
   */
  var snake = {
    /**
     * Current snake's direction
     */
    direction: directions.up,
    /**
     * Snake parts positions
     */
    positions: [],
    /**
     * Move snake
     */
    move: function() {
      var head = [this.positions[0][0] + this.direction[0],
        this.positions[0][1] + this.direction[1]
      ];
      this.positions.pop();
      this.positions.unshift(head);
    },
    /**
     * Expand snake
     */
    eat: function() {
      var head = [this.positions[0][0] + this.direction[0],
        this.positions[0][1] + this.direction[1]
      ];
      this.positions.unshift(head);
    }
  };

  return snake;
});
