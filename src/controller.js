/**
 * HTML5 Canvas snake window.snake.game
 * game
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */

define(['util', 'game', 'audio', 'controls'],
  function(util, game, audio, controls) {
    var controller = {
      /**
       * Initialize snake game
       * @param {string} id
       */
      initialize: function(id) {

        // default values
        /*jshint multistr: true */
        var snakeHeadImageURL =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA\
AEAAAABAQMAAAAl21bKAAAAA1BMVEVYCxel8h7eAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5E\
rkJggg==';
        /*jshint multistr: true */
        var foodImageURL =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA\
BAQMAAAAl21bKAAAAA1BMVEX/zAB+rZF1AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg\
==';
        //read url parameters
        var params = util.getUrlVars();
        if (params.head) {
          snakeHeadImageURL = (util.isEncoded(params.head) ?
            decodeURIComponent(params.head) :
            params.head
            );
        }
        if (params.food) {
          foodImageURL = decodeURIComponent(params.food);
        }

        /* Set snake head from image */
        var snakeHeadImage = new Image();
        snakeHeadImage.src = snakeHeadImageURL;
        /* Set food from image */
        var foodImage = new Image();
        foodImage.src = foodImageURL;

        //Canvas stuff
        game.canvas = window.document.getElementById(id);
        game.context = game.canvas.getContext('2d');
        game.context.font = '14px monospace';
        game.canvasWidth = game.canvas.offsetWidth;
        game.canvasHeight = game.canvas.offsetHeight;

        audio.initialize();
        controls.initialize();

        game.setup(snakeHeadImage, foodImage);
        game.pause();
      }
    };

    //Expose
    return controller;
  });
