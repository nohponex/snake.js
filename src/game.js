/**
 * HTML5 Canvas snake
 * game
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */
define(['snake', 'food', 'directions', 'theme', 'audio'],
  function(snake, food, directions, theme, audio) {
    /**
     * Game board
     * @type {Object}
     */
    var game = {
      interval: null,
      width: 0,
      height: 0,
      boxWidth: 15,
      boxHeight: 15,
      //food: null,
      foods: null,
      score: 0,
      gameOver: true,
      clearBorder: true,
      sounds: true,
      paused: false,
      level: 0,
      canvas: null,
      canvasWidth: 0,
      canvasHeight: 0,
      context: null,
      levelSpeed: [200, 199, 197, 196, 194, 191, 189, 186, 183, 181, 178, 175,
        171, 168, 165, 161, 158, 154, 150, 147, 143, 139, 135, 131, 127, 123,
        119, 114, 110, 106, 101, 97, 92, 88, 83, 79, 74, 69, 64, 59, 55, 50,
        45, 40, 35], /*using 200-pow(i,1.35) */
      currentSpeed: 0,
      snakeHeadImage: null,
      foodImage: null,
      /**
       * Setup game
       */
      setup: function(snakeHeadImage, foodImage) {
        if (snakeHeadImage) {
          /* Set snake head from image */
          this.snakeHeadImage = snakeHeadImage;
        }

        if (foodImage) {
          /* Set food from image */
          this.foodImage = foodImage;
        }
        this.width = Math.ceil(this.canvasWidth / this.boxWidth) - 1;
        this.height = Math.ceil((this.canvasHeight - 30) / this.boxHeight) - 1;
        this.gameOver = false;
        this.clearBorder = true;

        snake.direction = directions.up;
        snake.positions = [[
            Math.floor(Math.random() * (this.width - 1)) + 1,
            Math.floor(
              Math.random() * (this.height - this.height / 2) + this.height / 2)
          ]];
        snake.eat();
        snake.eat();
        snake.eat();

        this.foods = food;

        game.score = 0;
        game.level = 0;
        game.currentSpeed = game.levelSpeed[ game.level ];
        game.interval = setInterval(game.tick, game.currentSpeed);

        game.drawScore();
      },
      /**
       * Initialize game
       */
      initialize: function() {

        this.gameOver = true;
        game.setup();
        clearInterval(game.interval);
        game.draw();
        game.drawGameover();
      },
      /**
       * Restart game
       */
      restart: function() {
        clearInterval(game.interval);
        game.setup();
      },
      /**
       * Pause game
       */
      pause: function() {
        game.paused = true;
        game.drawPaused();
      },
      /**
       * Resume game state
       */
      resume: function() {
        game.paused = false;
        if (!game.interval) {
          game.interval = setInterval(game.tick, game.currentSpeed);
        }

        game.drawScore();
      },
      /**
       * Game level up handler
       */
      levelUp: function() {
        if (game.level + 1 >= game.levelSpeed.length) {
          return;
        }

        if (game.interval) {
          clearInterval(game.interval);
          game.interval = null;
        }

        game.currentSpeed = game.levelSpeed[
          Math.min(++game.level, game.levelSpeed.length - 1)];
        //set new interval
        game.interval = setInterval(game.tick, game.currentSpeed);
      },
      /**
       * Game time tick
       */
      tick: function() {
        if (game.gameOver) {
          return;
        }

        if (game.paused) {
          game.draw();
          clearInterval(game.interval);
          game.interval = null;
          return;
        }

        if (game.foods && game.foods.position === null) {
          game.createFood();
        } else if (game.checkEatFood()) {
          snake.eat();
          game.createFood();
          game.score++;
          game.drawScore();
          audio.consume();
          if (game.score > game.level * 3) {
            game.levelUp();
          }
        }

        snake.move();

        if (game.foods && game.foods.position && game.level % 2) {
          game.foods.chase();
          game.foods.move();
        }

        game.draw();
        if (game.checkWallCollusion() || game.checkSnakeCollusion()) {
          game.gameOver = true;
        }

        if (game.gameOver) {
          audio.gameOver();
          clearInterval(game.interval);
          game.interval = null;
          game.drawScore();
          game.drawGameover();
          return;
        }

      },
      /**
       * Draw board
       */
      draw: function() {
        var i;
        var j;

        //Draw borders
        if (game.clearBorder) {
          game.context.clearRect(0,
            0,
            game.canvasWidth, this.boxHeight * game.height
            );
          game.context.fillStyle = theme.border;
          for (i = 0; i <= game.width; i++) {
            for (j = 0; j <= game.height; j++) {
              if (!j || !i || j === game.height || i === game.width) {
                game.context.fillRect(this.boxWidth * i,
                  this.boxHeight * j,
                  this.boxWidth,
                  this.boxHeight
                  );
              }
            }
          }

          game.clearBorder = false;
        } else {
          game.context.clearRect(this.boxWidth,
            this.boxHeight,
            (game.width - 1) * this.boxWidth,
            (game.height - 1) * this.boxHeight
            );
        }

        // Draw snake
        game.context.fillStyle = theme.snakeHead;
        game.context.drawImage(
          this.snakeHeadImage,
          this.boxWidth * snake.positions[0][0] + 0.5,
          this.boxHeight * snake.positions[0][1] + 0.5,
          this.boxWidth - 1,
          this.boxHeight - 1
          );

        /*game.context.fillRect(this.boxWidth * snake.positions[0][0] + 0.5,
         this.boxHeight * snake.positions[0][1] + 0.5,
         this.boxWidth - 1, this.boxHeight - 1
         );*/

        //game.context.drawImage(HeadImage,this.boxWidth * snake.positions[0][0] + 0.5, this.boxHeight * snake.positions[0][1] +0.5,this.boxWidth - 1, this.boxHeight - 1);

        game.context.fillStyle = theme.snake;
        for (i = 1; i < snake.positions.length - 1; ++i) {
          game.context.fillRect(this.boxWidth * snake.positions[i][0] + 0.5,
            this.boxHeight * snake.positions[i][1] + 0.5, this.boxWidth - 1,
            this.boxHeight - 1
            );
        }

        //Draw tail
        i = snake.positions.length - 1;
        game.context.fillStyle = theme.tail;
        game.context.fillRect(this.boxWidth * snake.positions[i][0] + 0.5,
          this.boxHeight * snake.positions[i][1] + 0.5, this.boxWidth - 1,
          this.boxHeight - 1
          );

        // Draw food
        if (game.foods && game.foods.position) {
          game.context.fillStyle = theme.food;
          /*game.context.fillRect(
           this.boxWidth * game.foods.position[0],
           this.boxHeight * game.foods.position[1],
           this.boxWidth, this.boxHeight
           );*/
          game.context.drawImage(
            this.foodImage,
            this.boxWidth * game.foods.position[0],
            this.boxWidth * game.foods.position[1],
            this.boxWidth,
            this.boxWidth
            );
        }
      },
      /**
       * Draw score details
       */
      drawScore: function() {
        game.context.clearRect(0, (game.height + 2) * this.boxHeight,
          game.canvasWidth,
          game.canvasHeight - (game.height + 2) * this.boxHeight
          );
        game.context.fillStyle = theme.score;
        game.context.fillText('Score: ' + this.score + ' Level: ' + this.level,
          this.boxWidth, (game.height + 3) * this.boxHeight
          );
      },
      /**
       * Draw gameover state controls
       */
      drawGameover: function() {
        game.context.fillStyle = theme.score;
        game.context.fillText('Game over press Enter to play',
          this.boxWidth + 175, (game.height + 3) * this.boxHeight);
      },
      /**
       * Draw paused state controls
       */
      drawPaused: function() {
        game.context.fillStyle = theme.score;
        game.context.fillText('Game paused press p to play',
          this.boxWidth + 175, (game.height + 3) * this.boxHeight);
      },
      /**
       * Check if snake collides with it self
       * @returns {boolean}
       */
      checkSnakeCollusion: function() {
        for (var i = 1; i < snake.positions.length; ++i) {
          if (snake.positions[i][0] === snake.positions[0][0] &&
            snake.positions[i][1] === snake.positions[0][1]) {
            return true;
          }
        }

        return false;
      },
      /**
       * Check if snake collides with wall
       * @returns {boolean}
       */
      checkWallCollusion: function() {
        var x = snake.positions[0][0];
        var y = snake.positions[0][1];
        if (!x || !y || x >= game.width || y >= game.height) {
          return true;
        }

        return false;
      },
      /**
       * Check if food is eaten
       * @returns {boolean}
       */
      checkEatFood: function() {
        if (!game.foods) {
          return false;
        }
        return (snake.positions[ 0 ][0] === game.foods.position[0] &&
          snake.positions[ 0 ][1] === game.foods.position[1]);
      },
      /**
       * Add food to game
       */
      createFood: function() {
        var x = 0;
        var y = 0;
        var found = false;
        do {
          found = false;
          x = Math.floor(Math.random() * game.height);
          y = Math.floor(Math.random() * game.width);
          if (!x || !y || x >= game.width || y >= game.height) {
            found = true;
            continue;
          }

          for (var i = 0; i < snake.positions.length; i++) {
            if (x === snake.positions[ i ][0] &&
              y === snake.positions[ i ][1]) {
              found = true;
              break;
            }
          }
        } while (found);
        game.foods.position = [x, y];
      }
    };

    return game;
  });
