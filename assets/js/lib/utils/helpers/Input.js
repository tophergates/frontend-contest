define([], function(){
  const KEY_CODES = {
    13: 'enter',
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  function handleKeyDown(e){
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;

    if(KEY_CODES[keyCode]){
      e.preventDefault();
      this.KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
  }

  function handleKeyUp(e){
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;

    if(KEY_CODES[keyCode]){
      e.preventDefault();
      this.KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
  }

  function handleDeviceOrientation(e){
    this.VELOCITY.a = Math.round(e.alpha);
    this.VELOCITY.y = Math.round(e.beta);
    this.VELOCITY.x = Math.round(e.gamma);
  }

  function handleTouchStart(e){
    e.preventDefault();
    this.KEY_STATUS[KEY_CODES[32]] = true;
  }

  function handleTouchEnd(e){
    e.preventDefault();
    this.KEY_STATUS[KEY_CODES[32]] = false;
  }

  function Input(){
    this.KEY_STATUS = {};
    this.VELOCITY   = {a: 0, x: 0, y: 0};

    for(code in KEY_CODES){
      this.KEY_STATUS[KEY_CODES[code]] = false;
    }

    // Add event listeners for desktop support
    document.addEventListener('keydown', handleKeyDown.bind(this), false);
    document.addEventListener('keyup', handleKeyUp.bind(this), false);

    // Add event listeners for mobile support
    if(window.DeviceOrientationEvent){
      window.addEventListener('deviceorientation', handleDeviceOrientation.bind(this), false);
    }

    window.addEventListener('touchstart', handleTouchStart.bind(this), false);
    window.addEventListener('touchend', handleTouchEnd.bind(this), false);
  }

  return new Input();
});
