define([], function(){
  /**
   * Define an object to hold all out images for the game so images
   * are only ever created once.  This type of object is known as a
   * singleton.
  */
  function imageRepository(){
    // Define images
    this.background  = new Image();
    this.spaceship   = new Image();
    this.bullet      = new Image();
    this.enemy       = new Image();
    this.enemyBullet = new Image();
    this.imagesLoaded = false;

    var numImages = 5;
    var numLoaded = 0;

    this.imageLoaded = function(){
      numLoaded++;

      if(numLoaded === numImages){
        //window.init();
        this.imagesLoaded = true;
      }
    };

    this.background.addEventListener('load', this.imageLoaded.bind(this), false);
    this.spaceship.addEventListener('load', this.imageLoaded.bind(this), false);
    this.bullet.addEventListener('load', this.imageLoaded.bind(this), false);
    this.enemy.addEventListener('load', this.imageLoaded.bind(this), false);
    this.enemyBullet.addEventListener('load', this.imageLoaded.bind(this), false);

    // Set image src
    this.background.src  = 'assets/img/game/starfield.png';
    this.spaceship.src   = 'assets/img/game/ship.png';
    this.bullet.src      = 'assets/img/game/bullet.png';
    this.enemy.src       = 'assets/img/game/enemy.png';
    this.enemyBullet.src = 'assets/img/game/bullet_enemy.png';
  }

  return new imageRepository();
});
