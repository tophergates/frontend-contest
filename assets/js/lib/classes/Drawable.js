define([], function(){
  /**
   * Creates the Drawable object which will be the base class for
   * all drawable objects in the game.  Sets up default variables
   * that all child objects will inherit, as well as the default
   * functions/methods.
  */
  function Drawable() {
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.collidableWith = "";
    this.isColliding = false;
    this.type = "";

    this.init = function(x, y, width, height){
      // Default variables/properties
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    };

    // Define abstract function to be implemented in child objects
    this.draw = function(){};
    this.move = function(){};
    this.isCollidableWith = function(object){
      return (this.collidableWith === object.type);
    }
  }

  return Drawable;
});
