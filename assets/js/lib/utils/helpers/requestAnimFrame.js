define([], function(){
  /**
   * requestAnim shim layer by Paul Irish
   * Finds the first API that works to optimize the animation loop,
   * otherwise defaults to setTimeout().
   */
  var requestAnimFrame = (function(){
  	return  window.requestAnimationFrame   ||
  			window.webkitRequestAnimationFrame ||
  			window.mozRequestAnimationFrame    ||
  			window.oRequestAnimationFrame      ||
  			window.msRequestAnimationFrame     ||
  			function(callback, element){
  				window.setTimeout(callback, 1000 / 60);
  			};
  })();

  return requestAnimFrame;
});
