var text;
window.onload = function()
{
  var game = new Troimo.Game({preload : Preload, init: Init, manager : Manager, render : Render});
}

function Preload(game)
{
	game.load.image(game, 'fireguy', 'src/img/fireguy.png');
}
function Init(game)
{
  game.text = game.write('Hi', 200, 10, 15, "#FFFFFF");
  game.shaker.play();
  game.add.spritesheet('fireguy', 240, 240)
}

function Render(game)
{
 
}

function Manager(game)
{

}

Manager.prototype =
{
  hello : function()
  {

  }
}