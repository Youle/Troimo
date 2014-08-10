var text;
window.onload = function()
{
  var game = new Troimo.Game({preload : Preload, init: Init, render : Render});
}

function Preload(game)
{
	game.load.image(game, 'fireguy', 'src/img/fireguy.png');
	game.load.image(game, 'bird', 'src/img/bird.png');
	game.load.image(game, 'city', 'src/img/city.png');
	game.load.image(game, 'sun', 'src/img/sun.png');
	game.load.image(game, 'fire', 'src/img/fire.png')
}
function Init(game)
{
  //game.text = game.write('Hi', 200, 10, 15, "#FFFFFF");
  game.shaker.play();
  game.map = {
  	length : 50
  }
  game.gravity = 1
  game.sun = game.add.spritesheet('sun', 600, 300);
  game.city = game.add.tilemap('city', 600, 600, renderTilemap(game));
  game.bird = game.add.spritesheet('bird', 360, 320, {x : 0, y : 100, ratio : 0.7, speed : 0, rapidity : 5, velocity : 0.1, wingForce : 0.3})
  game.background.alpha = 0.5;
  game.background.color = '#1c4f70';
  game.city.howFar = 0.6;
  game.add.animation(game.sun, 'idle')
  game.add.animation(game.bird, 'idle', 0, 1);
  game.add.animation(game.bird, 'down', 2, 5, 5);
  game.add.animation(game.bird, 'up', 6, 12, 3);
  game.add.animation(game.bird, 'death', 13);

  game.spawn = 400;
  game.meter = 0;
  game.animations.play(game.sun, 'idle')
  game.animations.play(game.bird, 'idle');

  game.dudes = [];
  game.manager = new Manager(game);
  game.manager.init(game);
  game.lastSpawn = 0
  window.onkeydown = function(e){keyDown(e, game)}
  window.onkeyup = function(e){keyUp(e, game)}
}
function renderTilemap(game)
{
	var layer = []
	for(var i = 0; i < game.map.length; i++)
	{
		layer.push(Math.floor(Math.random() * 3))
	}
	return layer;
}
function Render(game)
{
	game.frame++
	game.meter += Math.floor(game.speed);
	if(!Math.floor(game.speed))
		game.meter = 0
	game.sun.draw(game)
	game.bird.move(game);
	game.city.move(game)
	game.bird.y += game.bird.speed;
	game.city.draw(game);
	game.bird.draw(game);
	if(game.meter > game.spawn + game.lastSpawn)
	{
		game.frame = 0
		game.lastSpawn = game.meter;
		addDude(game);
	}
	for(var i = 0; i < game.dudes.length; i++)
	{
		var d = game.dudes[i];
		d.draw(game);
		d.fire.draw(game)
		d.manage(game);
	}
}

function addDude(game)
{
	var side = Math.random() > 0.5 ? true : false;
	var y = !!side ? 600 - 240 : 0;
	var ff = !!side ? 6 : 0; 
	var d = game.add.spritesheet('fireguy', 240, 240, {x : 800, y : y});
	d.fire = game.add.spritesheet('fire', 120, 120, {x : d.x + 60, y : d.y - 30});

	var f = Math.random() > 0.5 ? 0 : 6;

	game.add.animation(d, 'idle', ff, ff + 6);
	game.add.animation(d.fire, 'idle', f, f+6, 4);
	game.animations.play(d.fire, 'idle');
	game.animations.play(d, 'idle');
	d.manage = game.manager.manageDude;
	game.dudes.push(d);
}