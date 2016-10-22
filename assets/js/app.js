requirejs.config({
  baseUrl: 'assets/js',
  paths : {
    Background: 'lib/classes/Background',
    Bullet: 'lib/classes/Bullet',
    Drawable: 'lib/classes/Drawable',
    Enemy: 'lib/classes/Enemy',
    Game: 'lib/Game',
    imageRepository: 'lib/utils/helpers/imageRepository',
    Input: 'lib/utils/helpers/Input',
    mobilenav: 'mobilenav',
    Pool: 'lib/classes/Pool',
    requestAnimFrame: 'lib/utils/helpers/requestAnimFrame',
    Ship: 'lib/classes/Ship',
    SoundPool: 'lib/classes/SoundPool',
    QuadTree: 'lib/utils/helpers/QuadTree',
    whenReady: 'vendor/whenReady'
  }
});

require(['imageRepository', 'Game', 'mobilenav', 'whenReady'], function(imageRepository, Game, whenReady){
  document.whenReady(function(){
    var restartButton = document.getElementById('restart');

    var imageCheck = window.setInterval(function(){
      if(imageRepository.imagesLoaded){
        init();
      }
    }, 1000);

    function init(){
      clearInterval(imageCheck);
      Game.init();
    }
  });
});
