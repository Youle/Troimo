var text;
window.onload = function()
{
  var game = new Troimo.Game({preload : Preload, init: Init, manager : Manager, render : Render});
}

function Preload(game)
{
	game.load.image(game, 'fireguy', 'src/img/fireguy.png');
  game.load.image(game, 'bird', 'src/img/bird.png');
}
function Init(game)
{
  game.text = game.write('Hi', 200, 10, 15, "#FFFFFF");
  game.shaker.play();
  game.po = game.add.spritesheet('fireguy', 240, 240)
  game.bird = game.add.spritesheet('bird', 360, 320)
  game.add.animation(game.po, 'idle');
  game.add.animation(game.bird, 'idle', 0, 1);
  game.add.animation(game.bird, 'down', 2, 5);
  game.add.animation(game.bird, 'up', 6, 12);
  game.add.animation(game.bird, 'death', 13);
  game.animations.play(game.bird, 'death')
  game.animations.play(game.po, 'idle')
}

function Render(game)
{
	game.po.draw(game);
  game.bird.draw(game)
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