define(['imageRepository', 'SoundPool', 'Input', 'Drawable', 'Pool'], function(imageRepository, SoundPool, Input, Drawable, Pool){
  /**
   * Create the Ship object that the player controls.  The ship is
   * drawn on the ship canvas and uses dirty rectangles to move
   * around the screen.
  */
  function Ship(){
    this.speed          = 3;
    this.bulletPool     = new Pool(30);
    this.laserPool      = new SoundPool(10);
    this.collidableWith = 'enemyBullet';
    this.type           = 'ship';

    var fireRate = 15;
    var counter  = 0;

    this.init = function(x, y, width, height){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.alive = true;
      this.isColliding = false;
      this.bulletPool.init('bullet');
      this.laserPool.init('laser');
    }

    this.draw = function(){
      if(!this.isColliding){
        this.context.drawImage(imageRepository.spaceship, this.x, this.y);
      }
      else {
        this.alive = false;
      }
    };

    this.move = function(){
      counter++;

      if(Input.KEY_STATUS.left || Input.KEY_STATUS.right || Input.KEY_STATUS.down || Input.KEY_STATUS.up){
        this.context.clearRect(this.x, this.y, this.width, this.height);

        if(Input.KEY_STATUS.left){
          this.x -= this.speed;
          if(this.x <= 0){
            this.x = 0;
          }
        }
        if(Input.KEY_STATUS.right){
          this.x += this.speed;

          if(this.x >= this.canvasWidth - this.width){
            this.x = this.canvasWidth - this.width;
          }
        }
        if(Input.KEY_STATUS.up){
          this.y -= this.speed;

          if(this.y <= this.canvasHeight / 4*3){
            this.y = this.canvasHeight / 4*3;
          }
        }
        if(Input.KEY_STATUS.down){
          this.y += this.speed;

          if(this.y >= this.canvasHeight - this.height){
            this.y = this.canvasHeight - this.height;
          }
        }
      }

      this.draw();

      if(Input.KEY_STATUS.space && counter >= fireRate){
        this.fire();
        counter = 0;
      }
    };

    this.fire = function(){
      this.laserPool.get();
      this.bulletPool.getTwo(this.x + 6, this.y, 3,
                             this.x + 33, this.y, 3);
    };
  }

  Ship.prototype = new Drawable();

  return Ship;
});
