function keyDown(e, game)
{
	var k = e.keyCode;
	var acceptedKey = [38, 40, 32];
	var mood = k- 39
	if(acceptedKey.indexOf(k) != -1)
	{
		if(k == 32)
		{
			game.city.speedUp = true;
		}
		else if(game.bird.moveY != mood)
		{
			var anim = mood > 0 ? 'down' : 'up'
			game.animations.play(game.bird, anim)
			game.bird.moveY = mood;
		}
	}
}


function keyUp(e, game)
{
	var k = e.keyCode;
	var acceptedKey = [38, 40, 32];
	if(acceptedKey.indexOf(k) != -1)
	{
		if(k == 32)
		{
			game.city.speedUp = false;
		}
		else
		{
			game.animations.play(game.bird, 'idle')
			game.bird.moveY = 0;
		}
	}
}