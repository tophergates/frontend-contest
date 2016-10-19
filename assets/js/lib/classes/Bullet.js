define(['imageRepository', 'Drawable'], function(imageRepository, Drawable){
  /**
   * Creates the Bullet object which the ship fires.  The bullets are
   * drawn on the main canvas.
  */
  function Bullet(object){
    this.alive = false;
    var self   = object;

    this.spawn = function(x, y, speed){
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.alive = true;
    };

    this.draw = function(){
      this.context.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
      this.y -= this.speed;

      if(this.isColliding){
        return true;
      }
      else if(self === 'bullet' && this.y <= 0 - this.height){
        return true;
      }
      else if(self === 'enemyBullet' && this.y >= this.canvasHeight) {
        return true;
      }
      else {
        if(self === 'bullet'){
          this.context.drawImage(imageRepository.bullet, this.x, this.y);
        }
        else if(self === 'enemyBullet'){
          this.context.drawImage(imageRepository.enemyBullet, this.x, this.y);
        }
        return false;
      }
    };

    this.clear = function(){
      this.x = 0;
      this.y = 0;
      this.speed = 0;
      this.alive = false;
      this.isColliding = false;
    };
  }

  Bullet.prototype = new Drawable();

  return Bullet;
});
