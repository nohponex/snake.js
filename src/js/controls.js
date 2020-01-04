/**
 * HTML5 Canvas snake snake.game
 * Controls
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */

define(['snake', 'game', 'directions'], function(snake, game, directions) {
  var controls = {
    /**
     * Initialize controls
     */
    initialize: function() {
      /**
       * On keyword event function handler
       * @param {event} event
       */
      document.onkeydown = function(event) {
        switch (event.keyCode) {
          //left direction
          case 37:
          case 65:
            if (snake.direction === directions.left) {
              game.tick();
              game.resetInterval();
            } else if (
              directions.left !== directions.opposite(snake.direction)) {
              snake.direction = directions.left;
            }
            event.preventDefault();
            break;
            //up direction
          case 38:
          case 87:
            if (snake.direction === directions.up) {
              game.tick();
              game.resetInterval();
            } else if (
              directions.up !== directions.opposite(snake.direction)) {
              snake.direction = directions.up;
            }
            event.preventDefault();
            break;
            //right direction
          case 39:
          case 68:
            if (snake.direction === directions.right) {
              game.tick();
              game.resetInterval();
            } else if (
              directions.right !== directions.opposite(snake.direction)) {
              snake.direction = directions.right;
            }
            event.preventDefault();
            break;
            //down direction
          case 40:
          case 83:
            if (snake.direction === directions.down) {
              game.tick();
              game.resetInterval();
            } else if (
              directions.down !== directions.opposite(snake.direction)) {
              snake.direction = directions.down;
            }
            event.preventDefault();
            break;
            //enter key
          case 13:
            if (game.gameOver) {
              game.restart();
              event.preventDefault();
            }
            break;
            //p key
          case 80:
            if (game.gameOver) {
              game.restart();
              event.preventDefault();
            } else if (game.paused) {
              game.resume();
            } else {
              game.pause();
            }
            event.preventDefault();
            break;
        }
      };
    }
  };
  return controls;
});
