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
  var game          = new Game();
  var muteButton    = document.getElementById('mute');

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
       this.playCount = 0;
       this.isMuted   = false;

       // Get the canvas element
       this.bgCanvas   = document.getElementById('background');
       this.shipCanvas = document.getElementById('ship');
       this.mainCanvas = document.getElementById('main');

       // Test to see if canvas is supported
       if(this.bgCanvas.getContext){
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

         this.enemyBulletPool = new Pool(36);
         this.enemyBulletPool.init('enemyBullet');

         // Initialize the enemy pool object
         this.enemyPool = new Pool(18);
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

       // Speed this bitch up!
       this.background.speed += 1.5;
     };

     // Start screen
     this.startScreen = function(){
       var startScreen = document.getElementById('start-screen');
       var startButton   = document.getElementById('startBtn');

       // Display the start screen and mute button
       startScreen.style.display = 'block';
       muteButton.style.display  = 'block';

       // Handle clicks on the start button
       var handleClick = function(){
         // remove the event listener
         unbindEvents();

         // Hide the start screen and then remove it from the DOM
         startScreen.style.display = 'none';
         startButton.remove();
         startScreen.remove();

         // Start the game
         game.start();
       };

       // Handle the enter key to start the game
       var handleKeyDown = function(){
         if(Input.KEY_STATUS.enter){
           // Remove the event listener
           unbindEvents();

           // Hide the start screen and then remove from the DOM
           startScreen.style.display = 'none';
           startButton.remove();
           startScreen.remove();

           // Start the game
           game.start();
         }
       };

       var unbindEvents = function(){
         startButton.removeEventListener('click', handleClick, false);
         document.removeEventListener('keydown', handleKeyDown, false);
       };

       // Bind events to click and enter key
       startButton.addEventListener('click', handleClick, false);
       document.addEventListener('keydown', handleKeyDown, false);
     };

     // Start the animation loop
     this.start = function(){
       var scoreBoard    = document.getElementById('score-board');
       game.playCount++;

       scoreBoard.style.display  = 'block';
       this.ship.draw();
       this.backgroundAudio.play();
       animate();
     };

     this.gameOver = function(){
       var gameOverScreen = document.getElementById('game-over');
       var restartButton  = document.getElementById('restart');

       // Pause the background audio
       this.backgroundAudio.pause();

       // Reset the gameover audio and play it
       this.gameOverAudio.currentTime = 0;
       this.gameOverAudio.play();

       // Display the game over screen
       gameOverScreen.style.display = 'block';

       var handleClick = function(){
         if(!game.ship.alive){
           unbindEvents();
           gameOverScreen.style.display = 'none';
           game.restart();
         }
       };

       var handleKeyDown = function(){
         if(!game.ship.alive && Input.KEY_STATUS.enter){
           unbindEvents();

           gameOverScreen.style.display = 'none';
           game.restart();
         }
       };

       var unbindEvents = function(){
         document.removeEventListener('keydown', handleKeyDown, false);
         restartButton.removeEventListener('click', handleClick, false);
       };

       // Bind events for click and keydown
       restartButton.addEventListener('click', handleClick, false);
       document.addEventListener('keydown', handleKeyDown, false);
     };

     this.restart = function(){
       var score = document.getElementById('score');

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

       this.gameOverAudio.pause();
       this.backgroundAudio.currentTime = 0;
       this.backgroundAudio.play();

       if(this.isMuted){
         toggleAudio('off');
       }

       score.innerHTML = 0;

       this.start();
     };
  }

  function toggleAudio(onoff){
    var laserPool     = game.ship.laserPool.pool;
    var explosionPool = game.enemyPool.getPool()[0].explosionPool.pool;
    var volume        = 0.15;

    var mute = function(){
      game.isMuted = true;

      // Set mute button to reflect the volume has been muted
      muteButton.innerHTML = '<i class="fa fa-lg fa-fw fa-volume-off"></i>';
      muteButton.setAttribute('class', 'game-element active');

      // Mute the game background audio and game over audio
	    game.backgroundAudio.volume = 0;
			game.gameOverAudio.volume = 0;

      // Loop through laser and explosion sound pools to mute audio
      for(var i=0; i<laserPool.length; i++){
        laserPool[i].volume = 0;
      }
      for(var i=0; i<explosionPool.length; i++){
        explosionPool[i].volume = 0;
      }
    };

    var unmute = function(){
      game.isMuted = false;

      // Set mute button to reflect the volume is unmuted
      muteButton.innerHTML = '<i class="fa fa-lg fa-fw fa-volume-up"></i>';
      muteButton.setAttribute('class', 'game-element');

      // Unmute the background audio and game over audio
			game.backgroundAudio.volume = volume;
			game.gameOverAudio.volume = volume;

      // Loop through laser and explosion sound pools to unmute audio
      for(var i=0; i<laserPool.length; i++){
        laserPool[i].volume = volume;
      }
      for(var i=0; i<explosionPool.length; i++){
        explosionPool[i].volume = volume;
      }
    };

    if(game.backgroundAudio.volume > 0 || onoff === 'off'){
      mute();
		}
		else {
      unmute();
		}
  }

  function checkReadyState(){
    var loadingScreen = document.getElementById('loading');

    if(game.gameOverAudio.readyState === 4 && game.backgroundAudio.readyState === 4){
      window.clearInterval(game.checkAudio);
      loadingScreen.style.display = "none";
      loadingScreen.remove();
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

  // Mute Audio Button
  muteButton.addEventListener('click', toggleAudio, false);

  return game;
});
