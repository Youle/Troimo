window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();


(function() {
    var canvas = document.getElementById('canvas');
    var game = {
      context : canvas.getContext('2d'),
      width : 800,
      height : 600,
      bgColor : "#bedae3",
    	config : httpGetData("src/json/filesReffering.json"),
      frameCounter : 0,
      snails : [],
      speed : 0,
      deadLine : {
        x : 650,
        width : 4,
        color : "#930202"
      },
      difficulty : 5,
      pointer : [0, 0],
      manager : new Manager(),
      stats : {
        mad : 0,
        safed : 0
      },
      menu : new Menu(),
      typer : new WordTyper(),
      state : "menu"
    };
    game.hud = new HUD(game)

    game.manager.newSnails(game);
    canvas.setAttribute('width', game.width);
    canvas.setAttribute('height', game.height);
    window.onkeypress = function(e)
    {
      listener(game, e)
    }
    game.menu.test = [];
    game.menu.test.push(game.typer.typethis(game, "Prevent raped snails", 150, 20, 4, "#000000"))
    game.menu.test.push(game.typer.typethis(game, "to birth", 150, 64, 4, "#000000"))
    game.menu.test.push(game.typer.typethis(game, "Click on your keyboard", 170, 370, 3, "#000000"))
    game.menu.test.push(game.typer.typethis(game, "the number corresponding with", 130, 400, 3, "#000000"))
    game.menu.test.push(game.typer.typethis(game, "the first raped snail and", 170, 430, 3, "#000000"))
    game.menu.test.push(game.typer.typethis(game, "your pills palette", 230, 460, 3, "#000000"))
    Render(game)
}());

function Render(game){
    game.frameCounter++
    game.context.fillStyle = game.bgColor;
    game.context.fillRect(0, 0, game.width, game.width);
    game.context.fillStyle = game.deadLine.color;
    game.context.fillRect(game.deadLine.x, 0, game.deadLine.width, game.height);
    for(var i = 0; i < game.snails.length; i++)
    {
      for(var j = 0; j < game.snails[i].length; j++)
      {
        game.snails[i][j].draw(game);
      }
    }
    game.hud.display(game);
    if(game.state == "menu")
    {
      game.menu.manage(game)
    }
    else if(game.state == "play")
    {

    }
    requestAnimFrame(function(){Render(game)});
};
