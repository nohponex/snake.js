/**
 * HTML5 Canvas snake game
 * TODO:
 * food
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */

define(['snake', 'directions'], function(snake, directions) {
  /**
   * Food object
   * @param {Array} position
   */
  var Food = function(position, type) {
    this.direction = null;
    this.position = position;
    this.type = (type || Food.prototype.Types.passive);
  };

  Food.prototype.Types = {
    passive: 1,
    hostile: 4,
    life: 2
  };
  /**
   * Activate food chase mode
   * WARNING: Experimental!
   */
  Food.prototype.chase = function() {
    //console.log('chase');
    this.direction = null;
    if (this.type === Food.prototype.Types.life) {
      return;
    }

    var diffX = snake.positions[0][0] - this.position[0];
    var diffY = snake.positions[0][1] - this.position[1];
    var dist;
    var alternative = null;

    // < to avoid, > to chase
    if (
      (this.type === Food.prototype.Types.passive &&
        Math.abs(diffX) < Math.abs(diffY)) ||
      (this.type === Food.prototype.Types.hostile &&
        Math.abs(diffX) >= Math.abs(diffY))) {

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

    if (this.type === Food.prototype.Types.passive) {
      this.direction = directions.opposite(this.direction);
      alternative = directions.opposite(alternative);
    }

    if (this.willCollide(this.direction)) {
      this.direction = null;
      console.log('avoiding collition with snake`s body');
      if (/*dist !== 0 && */!this.willCollide(alternative)) {
        this.direction = alternative;
        console.log('use alternative direction');
      }
    }
    if (this.direction && this.outOfBorders(this.direction)) {
      console.log('outOfBorders');
      this.direction = null;
      if (!this.outOfBorders(alternative) && !this.willCollide(alternative)) {
        this.direction = alternative;
      }
    }
  };

  /**
   * Move food
   * WARNING:  Experimental!
   */
  Food.prototype.move = function() {
    if (!this.direction) {
      return;
    }
    var steps = (this.type == Food.prototype.Types.passive ? 5 : 2);
    //Miss 1 in 7 steps
    if (Math.floor((Math.random() * steps)) === 0) {
      return;
    }
    this.position[0] += this.direction[0];
    this.position[1] += this.direction[1];
  };
  /**
   * Check if direction will collide with snake's body
   * @param {Array} direction
   */
  Food.prototype.willCollide = function(direction) {
    if (!direction) {
      direction = [0, 0];
    }
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
    //check if collides with other foods
    var game = require('game');
    return game.foods.some(function(f) {
      if (f.position[0] === position[0] && f.position[1] === position[1]) {
        console.log('COLLIDE WITH OTHER FOOD');
        return true;
      }
    });
    //return false;
  };
  /**
   * Check if direction will cause outOfBorders
   * @param {Array} direction
   */
  Food.prototype.outOfBorders = function(direction) {
    if (!direction) {
      direction = [0, 0];
    }
    var position = [
      this.position[0] + direction[0],
      this.position[1] + direction[1]
    ];
    var game = require('game');
    //todo reset +/- 1
    if (position[0] <= 1 || position[1] <= 1 ||
      position[0] >= game.width - 1 || position[1] >= game.height - 1) {
      return true;
    }

    return false;
  };

  //Expose
  return Food;
});
