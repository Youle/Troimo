var text;
window.onload = function()
{
  var game = new Troimo.Game({init: Init, manager : Manager, render : Render});
}

function Init(game)
{
  game.text = game.write('Hi', 200, 10, 15, "#FFFFFF");
  game.shaker.play();
}

function Render(game)
{
  game.context.fillStyle = 'red';
  game.context.fillRect(game.x + 20, game.y + 20, 200, 200)
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