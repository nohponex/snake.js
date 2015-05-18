/**
 * HTML5 Canvas snake window.snake.game
 * theme
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */

define([], function() {
  /**
   * Color theme
   * @type {Object}
   */
  var theme = {
    snake: '#9C4150',
    snakeHead: '#580B17',
    food: '#FFCC00', //'#FFCC00',
    foodHostile: '#E90B1D', //'#FFCC00',
    foodLife: '#10C910',
    score: '#9C4150',
    border: '#2D2D2D',
    /*background: '#E3E8E1',*/
    tail: 'rgba(156, 65, 80, 0.75)'
  };
  //Expose
  return theme;
});
