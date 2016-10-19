define([], function(){
  var sounds = {
    laser: 'assets/sounds/laser.wav',
    explosion: 'assets/sounds/explosion.wav'
  };

  function SoundPool(maxSize){
    var size = maxSize;
    var pool = [];
    this.pool = pool;
    var currSound = 0;

    this.init = function(object){
      if(object === 'laser'){
        for(var i=0; i < size; i++){
          var laser = new Audio(sounds.laser);
          laser.volume = 0.15;
          laser.load();
          pool[i] = laser;
        }
      }
      else if(object === 'explosion'){
        for(var i=0; i < size; i++){
          var explosion = new Audio(sounds.explosion);
          explosion.volume = 0.1;
          explosion.load();
          pool[i] = explosion;
        }
      }
    };

    this.get = function(){
      if(pool[currSound].currentTime === 0 || pool[currSound].ended){
        pool[currSound].play();
      }
      currSound = (currSound + 1) % size;
    };
  }

  return SoundPool;
});
