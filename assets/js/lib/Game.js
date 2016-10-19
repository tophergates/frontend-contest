define([
  'Background',
  'Bullet',
  'Enemy',
  'imageRepository',
  'Input',
  'Pool',
  'requestAnimFrame',
  'Ship',
  'SoundPool',
  'QuadTree'
], function(Background, Bullet, Enemy, imageRepository, Input, Pool, requestAnimFrame, Ship, SoundPool, QuadTree){
  var game = new Game();
  var startButton = document.getElementById('startBtn');
  var restartButton = document.getElementById('restart');
  var score = document.getElementById('score');
  var muteButton = document.getElementById('mute');
  var muted = false;

  /**
   * Creates the Game object which will hold all objects and data
   * for the game.
  */
  function Game(){
    /*
  	 * Gets canvas information and context and sets up all game
  	 * objects.
  	 * Returns true if the canvas is supported and false if it
  	 * is not. This is to stop the animation script from constantly
  	 * running on older browsers.
  	 */
     this.init = function(){
       // Get the canvas element
       this.bgCanvas   = document.getElementById('background');
       this.shipCanvas = document.getElementById('ship');
       this.mainCanvas = document.getElementById('main');

       // Test to see if canvas is supported
       if(this.bgCanvas.getContext){
         this.gameCount   = 0;

         this.bgContext   = this.bgCanvas.getContext('2d');
         this.shipContext = this.shipCanvas.getContext('2d');
         this.mainContext = this.mainCanvas.getContext('2d');

         // Initialize objects to contain their context and canvas information
         Background.prototype.context      = this.bgContext;
         Background.prototype.canvasWidth  = this.bgCanvas.width;
         Background.prototype.canvasHeight = this.bgCanvas.height;

         Ship.prototype.context      = this.shipContext;
         Ship.prototype.canvasWidth  = this.shipCanvas.width;
         Ship.prototype.canvasHeight = this.shipCanvas.height;

         Bullet.prototype.context      = this.mainContext;
         Bullet.prototype.canvasWidth  = this.mainCanvas.width;
         Bullet.prototype.canvasHeight = this.mainCanvas.height;

         Enemy.prototype.context      = this.mainContext;
         Enemy.prototype.canvasWidth  = this.mainCanvas.width;
         Enemy.prototype.canvasHeight = this.mainCanvas.height;

         // Initialize the background object
         this.background = new Background();
         this.background.init(0, 0);

         // Initialize the ship object
         this.ship = new Ship();
         this.shipStartX = this.shipCanvas.width / 2 - imageRepository.spaceship.width;
         this.shipStartY = this.shipCanvas.height / 4*3 + imageRepository.spaceship.height * 2;

         this.ship.init(this.shipStartX, this.shipStartY, imageRepository.spaceship.width, imageRepository.spaceship.height);

         this.enemyBulletPool = new Pool(30);
         this.enemyBulletPool.init('enemyBullet');

         // Initialize the enemy pool object
         this.enemyPool = new Pool(30);
         this.enemyPool.init('enemy', this.enemyBulletPool);
         this.spawnWave();

         // Start QuadTree
         this.quadTree = new QuadTree({
           x: 0,
           y: 0,
           width: this.mainCanvas.width,
           height: this.mainCanvas.height
         });

         // Setup the Game Audio
         this.backgroundAudio = new Audio('assets/sounds/kick_shock.wav');
         this.backgroundAudio.loop = true;
         this.backgroundAudio.volume = 0.15;
         this.backgroundAudio.load();

         this.gameOverAudio = new Audio('assets/sounds/game_over.wav');
         this.gameOverAudio.loop = true;
         this.gameOverAudio.volume = 0.15;
         this.gameOverAudio.load();

         this.checkAudio = window.setInterval(function(){
           checkReadyState();
         }, 1000);

         return true;
       }
       else {
         return false;
       }
     };

     this.spawnWave = function(){
       var height = imageRepository.enemy.height;
       var width  = imageRepository.enemy.width;
       var x      = 100;
       var y      = -height;
       var spacer    = y * 1.5;

       for(var i=1; i <= 18; i++){
         this.enemyPool.get(x, y, 2);
         x += width + 25;
         if(i % 6 === 0){
           x = 100;
           y += spacer;
         }
       }
     };

     // Start screen
     this.startScreen = function(){
       var startScreen = document.getElementById('start-screen');
       startScreen.style.display = 'block';
     };

     // Start the animation loop
     this.start = function(){
       this.gameCount++;
       this.ship.draw();
       this.backgroundAudio.play();
       animate();
     };

     this.gameOver = function(){
       this.backgroundAudio.pause();
       this.gameOverAudio.currentTime = 0;
       this.gameOverAudio.play();
       document.getElementById('game-over').style.display = 'block';
     };

     this.restart = function(){
       // Pause the game over audio and hide the game over DIV
       this.gameOverAudio.pause();
       document.getElementById('game-over').style.display = 'none';

       // Clear all canvases
       this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
       this.shipContext.clearRect(0, 0, this.shipCanvas.width, this.shipCanvas.height);
       this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

       // Restart the game
       this.quadTree.clear();
       this.background.init(0, 0);
       this.ship.init(this.shipStartX, this.shipStartY, imageRepository.spaceship.width, imageRepository.spaceship.height);
       this.enemyBulletPool.init('enemyBullet');
       this.enemyPool.init('enemy', this.enemyBulletPool);
       this.spawnWave();
       this.backgroundAudio.currentTime = 0;
       this.backgroundAudio.play();

       score.innerHTML = 0;

       this.start();
     };
  }

  function checkReadyState(){
    if(game.gameOverAudio.readyState === 4 && game.backgroundAudio.readyState === 4){
      window.clearInterval(game.checkAudio);
      document.getElementById('loading').style.display = "none";
      game.startScreen();
    }
  }

  function detectCollision(){
    var objects = [];
    game.quadTree.getAllObjects(objects);

    for(var x = 0, len = objects.length; x < len; x++){
      game.quadTree.findObjects(obj = [], objects[x]);

      for(var y = 0, length = obj.length; y < length; y++){

        if (objects[x].collidableWith === obj[y].type &&
           (objects[x].x < obj[y].x + obj[y].width &&
            objects[x].x + objects[x].width > obj[y].x &&
            objects[x].y < obj[y].y + obj[y].height &&
            objects[x].y + objects[x].height > obj[y].y)) {
                objects[x].isColliding = true;
                obj[y].isColliding = true;
        }
      }
    }
  }

  /**
   * The animation loop. Calls the requestAnimationFrame shim to
   * optimize the game loop and draws all game objects. This
   * function must be a gobal function and cannot be within an
   * object.
   */
  function animate(){
    game.quadTree.clear();
    game.quadTree.insert(game.ship);
    game.quadTree.insert(game.ship.bulletPool.getPool());
    game.quadTree.insert(game.enemyPool.getPool());
    game.quadTree.insert(game.enemyBulletPool.getPool());

    detectCollision();

    if(game.enemyPool.getPool().length === 0){
      game.spawnWave();
    }

    if(game.ship.alive){
      requestAnimFrame( animate );
      game.background.draw();
      game.ship.move();
      game.ship.bulletPool.animate();
      game.enemyPool.animate();
      game.enemyBulletPool.animate();
    }
    else {
      game.gameOver();
    }
  }

  // Start button click
  startBtn.addEventListener('click', function(){
    document.getElementById('start-screen').style.display = 'none';
    game.start();
  }, false);

  // Restart game button
  restartButton.addEventListener('click', function(){
    game.restart();
  }, false);

  // Restart game "ENTER" keydown
  document.addEventListener('keydown', function(){
    if(!game.ship.alive && Input.KEY_STATUS.enter){
      game.restart();
    }
    else if(game.ship.alive && Input.KEY_STATUS.enter){
      document.getElementById('start-screen').style.display = 'none';
      game.start();
    }
  }, false);

  // Mute Audio Button
  muteButton.addEventListener('click', function(){
    if(game.backgroundAudio.volume === .25){
        muteButton.innerHTML = 'Unmute';
		    game.backgroundAudio.volume = 0;
				game.gameOverAudio.volume = 0;
		}
		else {
      muteButton.innerHTML = 'Mute';
			game.backgroundAudio.volume = .25;
			game.gameOverAudio.volume = .25;
		}
  }, false);

  return game;
});
