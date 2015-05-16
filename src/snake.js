/*var HeadImage = new Image();
 HeadImage.src = 'images/Q.png';*/

(function() {

  /**
   * Color theme
   * @wtf xx
   * @type object
   */
  var theme = {
    snake: '#9C4150',
    snakeHead: '#222',
    food: '#FFFF66',
    score: '#9C4150',
    border: '#B3D4A7',
    background: '#C6D4C1',
    tail: 'rgba(156, 65, 80, 0.75)'
  };

  /**
   * Movement directions
   * @type object
   */
  var directions = {
    left: [-1, 0],
    right: [+1, 0],
    up: [0, -1],
    down: [0, +1],
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

  /**
   * Snake object
   * @type object
   */
  var snake = {
    direction: directions.up,
    positions: [],
    move: function() {
      var head = [this.positions[0][0] + this.direction[0],
        this.positions[0][1] + this.direction[1]
      ];
      this.positions.pop();
      this.positions.unshift(head);
    },
    eat: function() {
      var head = [this.positions[0][0] + this.direction[0],
        this.positions[0][1] + this.direction[1]
      ];
      this.positions.unshift(head);
    }
  };

  var game = {
    interval: null,
    width: 0,
    height: 0,
    boxWidth: 15,
    boxHeight: 15,
    food: null,
    score: 0,
    gameOver: true,
    clearBorder: true,
    sounds: true,
    paused: false,
    level: 0,
    levelSpeed: [200, 199, 197, 196, 194, 191, 189, 186, 183, 181, 178, 175,
      171, 168, 165, 161, 158, 154, 150, 147, 143, 139, 135, 131, 127, 123,
      119, 114, 110, 106, 101, 97, 92, 88, 83, 79, 74, 69, 64, 59, 55, 50,
      45, 40, 35], /*using 200-pow(i,1.35) */
    currentSeed: 0,
    setup: function() {
      this.width = Math.floor(width / this.boxWidth) - 1;
      this.height = Math.floor((height - 30) / this.boxHeight) - 1;
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
      game.score = 0;
      game.level = 0;
      game.currentSeed = game.levelSpeed[ game.level ];
      game.interval = setInterval(game.tick, game.currentSeed);
      game.drawScore();
    },
    initialize: function() {
      game.setup();
      this.gameOver = true;
      clearInterval(game.interval);
      game.draw();
      game.drawGameover();
    },
    restart: function() {
      console.log('restart');
      clearInterval(game.interval);
      game.setup();
    },
    pause: function() {
      game.paused = true;
      game.drawPaused();
    },
    resume: function() {
      game.paused = false;
      if (!game.interval) {
        game.interval = setInterval(game.tick, game.currentSeed);
      }

      game.drawScore();
    },
    levelUp: function() {
      if (game.level + 1 >= game.levelSpeed.length) {
        return;
      }

      if (game.interval) {
        clearInterval(game.interval);
        game.interval = null;
      }

      game.currentSeed = game.levelSpeed[ ++game.level ];
      game.interval = setInterval(game.tick, game.currentSeed);
    },
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

      if (game.food === null) {
        game.createFood();
      } else if (game.checkEatFood()) {
        snake.eat();
        game.createFood();
        game.score++;
        game.drawScore();
        AudioPlayer.consume();
        if (game.score > game.level * 4) {
          game.levelUp();
        }
      }

      snake.move();
      game.draw();
      if (game.checkWallCollusion() || game.checkSnakeCollusion()) {
        game.gameOver = true;
      }

      if (game.gameOver) {
        clearInterval(game.interval);
        console.log('game over');
        game.drawScore();
        game.drawGameover();
        return;
      }

    },
    draw: function() {

      var i;
      var j;

      //Draw borders
      if (game.clearBorder) {
        context.clearRect(0, 0, width, this.boxHeight * game.height);
        context.fillStyle = theme.border;
        for (i = 0; i <= game.width; i++) {
          for (j = 0; j <= game.height; j++) {
            if (!j || !i || j == game.height || i == game.width) {
              context.fillRect(this.boxWidth * i,
                this.boxHeight * j,
                this.boxWidth,
                this.boxHeight
                );
            }
          }
        }

        game.clearBorder = false;
      } else {
        context.clearRect(this.boxWidth,
          this.boxHeight,
          (game.width - 1) * this.boxWidth,
          (game.height - 1) * this.boxHeight
          );
      }

      // Draw snake
      context.fillStyle = theme.snakeHead;
      context.fillRect(this.boxWidth * snake.positions[0][0] + 0.5,
        this.boxHeight * snake.positions[0][1] + 0.5,
        this.boxWidth - 1, this.boxHeight - 1
        );

      //context.font = '15px Arial';
      //context.drawImage(HeadImage,this.boxWidth * snake.positions[0][0] + 0.5, this.boxHeight * snake.positions[0][1] +0.5,this.boxWidth - 1, this.boxHeight - 1);

      context.fillStyle = theme.snake;
      for (i = 1; i < snake.positions.length - 1; ++i) {
        context.fillRect(this.boxWidth * snake.positions[i][0] + 0.5,
          this.boxHeight * snake.positions[i][1] + 0.5, this.boxWidth - 1,
          this.boxHeight - 1
          );
      }

      //Draw tail
      i = snake.positions.length - 1;
      context.fillStyle = theme.tail;
      context.fillRect(this.boxWidth * snake.positions[i][0] + 0.5,
        this.boxHeight * snake.positions[i][1] + 0.5, this.boxWidth - 1,
        this.boxHeight - 1
        );

      // Draw food
      if (game.food) {
        context.fillStyle = theme.food;
        context.fillRect(this.boxWidth * game.food[0],
          this.boxHeight * game.food[1],
          this.boxWidth, this.boxHeight
          );
      }
    },
    drawScore: function() {
      context.clearRect(0, (game.height + 2) * this.boxHeight,
        width, height - (game.height + 2) * this.boxHeight
        );
      context.fillStyle = theme.score;
      context.fillText('Score : ' + this.score + ' Level : ' + this.level,
        this.boxWidth, (game.height + 3) * this.boxHeight
        );
    },
    drawGameover: function() {
      context.fillStyle = theme.score;
      context.fillText('Game over press Enter to play',
        this.boxWidth + 150, (game.height + 3) * this.boxHeight);
    },
    drawPaused: function() {
      context.fillStyle = theme.score;
      context.fillText('Game paused press p to play',
        this.boxWidth + 150, (game.height + 3) * this.boxHeight);
    },
    checkSnakeCollusion: function() {
      for (var i = 1; i < snake.positions.length; ++i) {
        if (snake.positions[i][0] === snake.positions[0][0] &&
          snake.positions[i][1] === snake.positions[0][1]) {
          return true;
        }
      }

      return false;
    },
    checkWallCollusion: function() {
      var x = snake.positions[0][0];
      var y = snake.positions[0][1];
      if (!x || !y || x >= game.width || y >= game.height) {
        return true;
      }

      return false;
    },
    checkEatFood: function() {
      return (snake.positions[ 0 ][0] == game.food[0] &&
        snake.positions[ 0 ][1] == game.food[1]);
    },
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
          if (x === snake.positions[ i ][0] && y === snake.positions[ i ][1]) {
            found = true;
            break;
          }
        }
      } while (found);
      game.food = [x, y];
    }
  };

  //Canvas stuff
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;

  game.setup();
  game.pause();

  document.onkeydown = function(event) {
    switch (event.keyCode) {
      case 37:
      case 65:
        if (snake.direction === directions.left) {
          game.tick();
        } else if (directions.left !== directions.opposite(snake.direction)) {
          snake.direction = directions.left;
        }
        event.preventDefault();
        break;
      case 38:
      case 87:
        if (snake.direction === directions.up) {
          game.tick();
        } else if (directions.up !== directions.opposite(snake.direction)) {
          snake.direction = directions.up;
        }
        event.preventDefault();
        break;
      case 39:
      case 68:
        if (snake.direction === directions.right) {
          game.tick();
        } else if (directions.right !== directions.opposite(snake.direction)) {
          snake.direction = directions.right;
        }
        event.preventDefault();
        break;
      case 40:
      case 83:
        if (snake.direction === directions.down) {
          game.tick();
        } else if (directions.down !== directions.opposite(snake.direction)) {
          snake.direction = directions.down;
        }
        event.preventDefault();
        break;
      case 13:
        if (game.gameOver) {
          game.restart();
          event.preventDefault();
        }
        break;
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

  var AudioPlayer = {
    sounds: {},
    consume: function() {
      this.sounds.consume.play();
    },
    initialize: function() {
      this.sounds.consume = new Audio();

      this.sounds.consume.setAttribute('src', 'sounds/pick_up.wav');
      this.sounds.consume.repeat = false;
      this.sounds.consume.loop = false;
      this.sounds.consume.volume = 0.15;

    }
  };

  AudioPlayer.initialize();
})();
