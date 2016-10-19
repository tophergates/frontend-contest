define(['imageRepository', 'Bullet', 'Enemy'], function(imageRepository, Bullet, Enemy){
  /**
   * Custom Pool object will hold bullet objects to be managed to
   * prevent garbage collection.
  */
  function Pool(maxSize){
    var size = maxSize;
    var pool = [];

    // Populate the pool array with Bullet objects
    this.init = function(object, poolObj){
      if(object === 'bullet'){
        for(var i=0; i < size; i++){
          var bullet = new Bullet('bullet');
          bullet.init(0, 0, imageRepository.bullet.width, imageRepository.bullet.height);
          bullet.collidableWith = 'enemy';
          bullet.type = 'bullter';
          pool[i] = bullet;
        }
      }
      else if(object === 'enemy'){
        for(var i=0; i < size; i++){
          var enemy = new Enemy(poolObj);
          enemy.init(0, 0, imageRepository.enemy.width, imageRepository.enemy.height);
          pool[i] = enemy;
        }
      }
      else if(object === 'enemyBullet'){
        for(var i=0; i < size; i++){
          var enemyBullet = new Bullet('enemyBullet');
          enemyBullet.init(0, 0, imageRepository.enemyBullet.width, imageRepository.enemyBullet.height);
          enemyBullet.collidableWith = 'ship';
          enemyBullet.type = 'enemyBullet';
          pool[i] = enemyBullet;
        }
      }
    };

    this.getPool = function(){
      var obj = [];
      for(var i = 0; i < size; i++){
        if(pool[i].alive){
          obj.push(pool[i]);
        }
      }

      return obj;
    };

    // Grabs the last item in the list, initialize it, and push it to the front of the array.
    this.get = function(x, y, speed){
      if(!pool[size - 1].alive){
        pool[size - 1].spawn(x, y, speed);
        pool.unshift(pool.pop());
      }
    };

    // Gets two objects from our object Pool.
    this.getTwo = function(x1, y1, speed1, x2, y2, speed2){
      if(!pool[size - 1].alive && !pool[size - 2].alive){
        this.get(x1, y1, speed1);
        this.get(x2, y2, speed2);
      }
    };

    this.animate = function(){
      for(var i=0; i < size; i++){
        if(pool[i].alive){
          if(pool[i].draw()){
            pool[i].clear();
            pool.push((pool.splice(i, 1))[0]);
          }
        }
        else {
          break;
        }
      }
    };
  }

  return Pool;
});
