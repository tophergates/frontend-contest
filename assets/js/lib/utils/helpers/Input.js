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

  function Input(){
    this.KEY_STATUS = {};

    for(code in KEY_CODES){
      this.KEY_STATUS[KEY_CODES[code]] = false;
    }

    // Add event listeners for desktop support
    document.addEventListener('keydown', handleKeyDown.bind(this), false);
    document.addEventListener('keyup', handleKeyUp.bind(this), false);
  }

  return new Input();
});
