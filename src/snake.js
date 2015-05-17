/**
 * HTML5 Canvas snake game
 * TODO:
 * - add food movement
 * - add obstacles
 *
 * @author Spafaridis Xenophon <nohponex@gmail.com>
 * @version 1
 */

(function(window) {
  /**
   * Color theme
   * @type {Object}
   */
  var theme = {
    snake: '#9C4150',
    snakeHead: '#580B17',
    food: '#FFCC00',
    score: '#9C4150',
    border: '#2D2D2D',
    /*background: '#E3E8E1',*/
    tail: 'rgba(156, 65, 80, 0.75)'
  };

  /**
   * Movement directions
   * @type {Object}
   */
  var directions = {
    left: [-1, 0],
    right: [+1, 0],
    up: [0, -1],
    down: [0, +1],
    /**
     * Get opposite direction
     * @param {Array} direction
     * @returns {Array} Returns opposite direction vector
     */
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

  var food = {
    direction: null,
    position: null,
    /**
     * Activate food chase mode
     * WARNING: Experimental!
     */
    chase: function() {
      //dump way
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
          this.direction = (diffX >= 0  ? directions.right : directions.left);
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

      if (position[0] < 1 || position[1] < 1 ||
        position[0] >= game.width || position[1] >= game.height) {
        return true;
      }

      return false;
    }
  };

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
    foods: food,
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
    setup: function(snakeHead, food) {
      if (snakeHead) {
        /* Set snake head from image */
        this.snakeHeadImage = snakeHead;
      }

      if (food) {
        /* Set food from image */
        this.foodImage = food;
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
      game.setup();
      this.gameOver = true;
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

      game.currentSpeed = game.levelSpeed[ ++game.level ];
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

      if (game.foods.position === null) {
        game.createFood();
      } else if (game.checkEatFood()) {
        snake.eat();
        game.createFood();
        game.score++;
        game.drawScore();
        AudioPlayer.consume();
        if (game.score > game.level * 3) {
          game.levelUp();
        }
      }

      snake.move();

      if (game.foods.position && game.level % 2) {
        game.foods.chase();
        game.foods.move();
      }

      game.draw();
      if (game.checkWallCollusion() || game.checkSnakeCollusion()) {
        game.gameOver = true;
      }

      if (game.gameOver) {
        AudioPlayer.gameOver();
        clearInterval(game.interval);
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
      if (game.foods.position) {
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
        game.canvasWidth, game.canvasHeight - (game.height + 2) * this.boxHeight
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
          if (x === snake.positions[ i ][0] && y === snake.positions[ i ][1]) {
            found = true;
            break;
          }
        }
      } while (found);
      game.foods.position = [x, y];
    }
  };

  window.snake = {
    /**
     * Initialize snake game
     * @param {string} id
     */
    initialize: function(id) {

      // default values
      /*jshint multistr: true */
      var snakeHeadImageURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA\
AEAAAABAQMAAAAl21bKAAAAA1BMVEVYCxel8h7eAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5E\
rkJggg==';
      /*jshint multistr: true */
      var foodImageURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA\
BAQMAAAAl21bKAAAAA1BMVEX/zAB+rZF1AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg\
==';
      //read url parameters
      var params = getUrlVars();
      if (params.head) {
        snakeHeadImageURL = (isEncoded(params.head) ?
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

      game.setup(snakeHeadImage, foodImage);
      game.pause();
    }
  };

  /**
   * Check if string is url encoded
   * @param {string} str
   * @returns {boolean}
   */
  function isEncoded(str) {
    return decodeURIComponent(str) !== str;
  }
  /**
   * Get url variables
   * @returns {Array}
   */
  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
      vars[key] = value;
    });
    return vars;
  }
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
        } else if (directions.left !== directions.opposite(snake.direction)) {
          snake.direction = directions.left;
        }
        event.preventDefault();
        break;
        //up direction
      case 38:
      case 87:
        if (snake.direction === directions.up) {
          game.tick();
        } else if (directions.up !== directions.opposite(snake.direction)) {
          snake.direction = directions.up;
        }
        event.preventDefault();
        break;
        //right direction
      case 39:
      case 68:
        if (snake.direction === directions.right) {
          game.tick();
        } else if (directions.right !== directions.opposite(snake.direction)) {
          snake.direction = directions.right;
        }
        event.preventDefault();
        break;
        //down direction
      case 40:
      case 83:
        if (snake.direction === directions.down) {
          game.tick();
        } else if (directions.down !== directions.opposite(snake.direction)) {
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
  /**
   * AudioPlayer object - contains sounds
   * @type {Object}
   */
  var AudioPlayer = {
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
      this.sounds.consume.volume = 0.15;

      this.sounds.gameOver = new Audio();

      this.sounds.gameOver.setAttribute('src', 'sounds/game_over.ogg');
      this.sounds.gameOver.repeat = false;
      this.sounds.gameOver.loop = false;
      this.sounds.gameOver.volume = 0.15;

    }
  };

  AudioPlayer.initialize();
})(window);
