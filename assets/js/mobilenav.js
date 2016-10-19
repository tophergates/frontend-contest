(function(){
  const navIcon = document.getElementById('nav-icon');
  const navList = document.getElementsByTagName('ul')[0];

  const handleClick = function(e){
    if(navIcon.className !== 'open'){
      navIcon.className += 'open';
      navList.className += 'open';
    }
    else {
      navIcon.className = '';
      navList.className = '';
    }
  };

  navIcon.addEventListener('click', handleClick);
}());
