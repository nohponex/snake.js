require(['controller', 'theme'], //{snake', 'food', 'util', 'controls', 'game', 'controller', 'audio'],
  function(controller, theme) { //snake, food, util, controls, game, controller, audio) {
    //Resize canvas
    var canvas = window.document.getElementById('canvas');

    var w = window.innerWidth;
    var h = window.innerHeight;
    var width = Math.round((w * 0.6) / 15) * 15;
    var height = Math.round((h * 0.75) / 15) * 15;

    canvas.width = width;
    canvas.height = height;

    //Display food colors as help
    window.document.querySelector('#foods .passive > span')
      .style['background-color'] = theme.food;

    window.document.querySelector('#foods .hostile > span')
      .style['background-color'] = theme.foodHostile;

    window.document.querySelector('#foods .life > span')
      .style['background-color'] = theme.foodLife;

    controller.initialize('canvas');
  });
