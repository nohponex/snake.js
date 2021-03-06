/**
 * HTML5 Canvas snake
 * game
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */
define(['snake', 'Food', 'directions', 'theme', 'audio'],
  function(snake, Food, directions, theme, audio) {
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
      foods: [],
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

        //clear foods
        game.foods.length = 0;

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
        //snake.eat();

        game.score = 0;
        game.level = 1;
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
       * Reset interval
       */
      resetInterval: function() {
        if (game.interval) {
          clearInterval(game.interval);
        }
        game.interval = setInterval(game.tick, game.currentSpeed);
      },
      /**
       * Resume game state
       */
      resume: function() {
        game.paused = false;
        this.resetInterval();
        game.drawScore();
      },
      /**
       * Game level up handler
       */
      levelUp: function() {
        if (game.level + 1 >= game.levelSpeed.length) {
          return;
        }
        var type = Food.prototype.Types.passive;
        //Add additional foods
        for (var i = game.foods.length - 1; i < game.level/* + 10*/; ++i) {

          if (i >= Math.round(game.level / 3) && true) {
            type = Food.prototype.Types.hostile;
          }
          game.createFood(type);
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
          audio.gameOver();
          clearInterval(game.interval);
          game.interval = null;
          game.drawScore();
          game.drawGameover();
          return;
        }

        if (game.paused) {
          game.draw();
          clearInterval(game.interval);
          game.interval = null;
          return;
        }

        if (game.foods.length && (game.level % 2 || true)) {
          game.foods.forEach(function(f) {
            f.chase();
            f.move();
          });
        }

        snake.move();

        var eaten;
        if (game.foods.length === 0) {
          game.createFood();
        } else if ((eaten = game.checkEatFood()) > 0) {
          snake.eat();
          //game.createFood();
          game.score += eaten;
          game.drawScore();
          audio.consume();
          if (game.score > game.level * 3) { //Score per level
            game.levelUp();
          }
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
        game.foods.forEach(function(f) {

          if (f.type === Food.prototype.Types.hostile) {
            game.context.fillStyle = theme.foodHostile;
            game.context.fillRect(
              game.boxWidth * f.position[0],
              game.boxHeight * f.position[1],
              game.boxWidth,
              game.boxHeight
              );
          } else if (f.type === Food.prototype.Types.life) {
            game.context.fillStyle = theme.foodLife;
            game.context.fillRect(
              game.boxWidth * f.position[0],
              game.boxHeight * f.position[1],
              game.boxWidth,
              game.boxHeight
              );
          } else {
            game.context.drawImage(
              game.foodImage,
              game.boxWidth * f.position[0],
              game.boxHeight * f.position[1],
              game.boxWidth,
              game.boxWidth
              );
          }
        });

      },
      /**
       * Draw score details
       */
      drawScore: function() {
        game.context.clearRect(0, (game.height + 1) * this.boxHeight,
          game.canvasWidth,
          game.canvasHeight - (game.height + 1) * this.boxHeight
          );
        game.context.fillStyle = theme.score;
        game.context.fillText('Score: ' + this.score + ' Level: ' + this.level,
          this.boxWidth, (game.height + 2) * this.boxHeight
          );
      },
      /**
       * Draw gameover state controls
       */
      drawGameover: function() {
        game.context.fillStyle = theme.score;
        game.context.fillText('Game over press Enter to play',
          this.boxWidth + 175, (game.height + 2) * this.boxHeight);
      },
      /**
       * Draw paused state controls
       */
      drawPaused: function() {
        game.context.fillStyle = theme.score;
        game.context.fillText('Game paused press p to play',
          this.boxWidth + 175, (game.height + 2) * this.boxHeight);
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
       * @returns {number}
       */
      checkEatFood: function() {
        var indeces = [];
        var count = {};
        for (var t in Food.prototype.Types) {
          count[Food.prototype.Types[t]] = 0;
        }

        game.foods.forEach(function(f, fIndex) {
          if (snake.positions.some(function(p, pIndex) {
            return p[0] === f.position[0] &&
              p[1] === f.position[1] &&
              (f.type !== Food.prototype.Types.hostile || pIndex === 0);
          })
            ) {

            //if type is passive
            if (f.type === Food.prototype.Types.passive) {
              //Push to remove list
              indeces.push(fIndex);
            } else if (f.type === Food.prototype.Types.life) {
              //todo add lifes
              //Push to remove list
              indeces.push(fIndex);
              //else if hostile
            } else if (f.type === Food.prototype.Types.hostile) {
              game.gameOver = true;
            }
          } else {
            ++count[f.type];
          }
        });

        if (!game.gameOver && indeces.length) {
          //remove eaten
          //game.foods = game.foods.filter(function(f, fIndex) {
          //return indeces.indexOf(fIndex) < 0;
          //});
          indeces.forEach(function(i) {
            game.foods.splice(i, 1);
          });
          /*for(var i = indeces.length - 1; i >= 0; --i){
           if (indeces.indexOf(indeces[i]) >= 0) {
           game.foods.splice(indeces[i], 1);
           }
           }*/
          //remove all hostiles if all others are eaten
          if (count[Food.prototype.Types.passive] === 0 &&
            count[Food.prototype.Types.life] === 0) {
            game.foods = game.foods.filter(function(f) {
              return f.type === Food.prototype.Types.passive;
            });
          }

          return indeces.length;
        } else {
          return 0;
        }
      },
      /**
       * Add food to game
       */
      createFood: function(type) {
        type =
          typeof type === 'undefined' ? Food.prototype.Types.passive : type;

        //create random life
        if (type === Food.prototype.Types.passive &&
          Math.round(Math.random() * 5) === 0) {
          type = Food.prototype.Types.life;
        }
        var x = 0;
        var y = 0;
        var found = false;
        /**
         * Check if a food exists at this x, y
         * @param {Food} f Food object
         * @returns {boolean}
         */
        var foodExist = function(f) {
          if (f.position[0] === x && f.position[1] === y) {
            found = true;
            return true;
          }
          return false;
        };

        do {
          found = false;
          x = Math.floor(Math.random() * (game.height - 3)) + 2;
          y = Math.floor(Math.random() * (game.width - 3)) + 2;
          if (!x || !y || x >= game.width || y >= game.height) {
            found = true;
            continue;
          }

          for (var i = 0, l = snake.positions.length; i < l; ++i) {
            if (x === snake.positions[i][0] &&
              y === snake.positions[i][1]) {
              found = true;
              break;
            }
          }
          //check if other foods exist
          if (!found) {
            found = game.foods.some(foodExist);
          }
        } while (found);
        var f = new Food([x, y], type);
        game.foods.push(f);
      }
    };

    return game;
  });
