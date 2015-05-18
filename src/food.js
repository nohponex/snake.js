/**
 * HTML5 Canvas snake game
 * TODO:
 * food
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */

define(['snake', 'directions'], function(snake, directions) {
  var food = {
    direction: null,
    position: null,
    /**
     * Activate food chase mode
     * WARNING: Experimental!
     */
    chase: function() {
      //console.log('chase');
      this.direction = directions.up;

      var diffX = snake.positions[0][0] - this.position[0];
      var diffY = snake.positions[0][1] - this.position[1];
      var dist;
      var alternative = null;

      // < to avoid, > to chase
      if (Math.abs(diffX) >= Math.abs(diffY)) {
        dist = diffX;
        if (diffX === 0) {
          this.direction = directions.opposite(snake.direction);
        } else {
          this.direction = (diffX >= 0 ? directions.right : directions.left);
        }
        alternative = (diffY >= 0 ? directions.down : directions.up);
      } else {
        dist = diffY;
        if (diffY === 0) {
          this.direction = directions.opposite(snake.direction);
        } else {
          this.direction = (diffY >= 0 ? directions.down : directions.up);
        }
        alternative = (diffX >= 0 ? directions.right : directions.left);
      }

      if (this.willCollide(this.direction)) {
        this.direction = null;
        console.log('avoiding collition with snake`s body');
        if (dist !== 0 && !this.willCollide(alternative)) {
          this.direction = alternative;
          console.log('use alternative direction');
        }
      }
      if (this.direction && this.outOfBorders(this.direction)) {
        console.log('outOfBorders');
        this.direction = null;
        if (!this.outOfBorders(alternative)) {
          this.direction = alternative;
        }
      }
    },
    /**
     * Move food
     * WARNING:  Experimental!
     */
    move: function() {
      if (!this.direction) {
        return;
      }
      //Miss 1 in 5 steps
      if (Math.floor((Math.random() * 5)) === 0) {
        //return;
      }
      this.position[0] += this.direction[0];
      this.position[1] += this.direction[1];
    },
    /**
     * Check if direction will collide with snake's body
     */
    willCollide: function(direction) {
      var position = [
        this.position[0] + direction[0],
        this.position[1] + direction[1]
      ];

      for (i = 1; i < snake.positions.length; ++i) {
        if (position[0] === snake.positions[i][0] &&
          position[1] === snake.positions[i][1]) {
          return true;
        }
      }

      return false;
    },
    /**
     * Check if direction will cause outOfBorders
     */
    outOfBorders: function(direction) {
      var position = [
        this.position[0] + direction[0],
        this.position[1] + direction[1]
      ];
      var game = require('game');
      if (position[0] < 1 || position[1] < 1 ||
        position[0] >= game.width || position[1] >= game.height) {
        return true;
      }

      return false;
    }
  };

  //Expose
  return food;
});
