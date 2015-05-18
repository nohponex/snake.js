/**
 * HTML5 Canvas snake window.snake.game
 * audio
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */

define([], function() {
  /**
   * AudioPlayer object - contains sounds
   * @type {Object}
   */
  var audio = {
    sounds: {},
    /**
     * Plays consume sound
     */
    consume: function() {
      this.sounds.consume.play();
    },
    /**
     * Plays gameOver sound
     */
    gameOver: function() {
      this.sounds.gameOver.play();
    },
    /**
     * Initialize AudioPlayer
     */
    initialize: function() {
      this.sounds.consume = new Audio();

      this.sounds.consume.setAttribute('src', 'sounds/pick_up.ogg');
      this.sounds.consume.repeat = false;
      this.sounds.consume.loop = false;
      this.sounds.consume.volume = 0.3;

      this.sounds.gameOver = new Audio();

      this.sounds.gameOver.setAttribute('src', 'sounds/game_over.ogg');
      this.sounds.gameOver.repeat = false;
      this.sounds.gameOver.loop = false;
      this.sounds.gameOver.volume = 0.3;

    }
  };
  return audio;
});
