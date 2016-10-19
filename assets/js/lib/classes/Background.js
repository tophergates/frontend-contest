define(['imageRepository', 'Drawable'], function(imageRepository, Drawable){
  /**
   * Creates the Background object which will become a child of
   * the Drawable object.  The background is drawn on the "background"
   * canvas and creates the illusion of movement by panning the image.
  */
  function Background(){
    this.speed = 1.25;

    this.draw = function(){
      this.x += this.speed;

      this.context.clearRect(0, 0, imageRepository.background.width, imageRepository.background.height);
      this.context.drawImage(imageRepository.background, this.x, this.y);

      // Draw another image at the top edge of the first image
      this.context.drawImage(imageRepository.background, this.x - this.canvasWidth, this.y);

      // If the image scrolled off the screen, reset
      if(this.x >= this.canvasWidth){
        this.x = 0;
      }
    };
  }

  Background.prototype = new Drawable();

  return Background;
});
