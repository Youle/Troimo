function Manager(game)
{

}

Manager.prototype =
{
  init : function(game)
  {
  	game.bird.moveY = 0
  	game.bird.move = this.moveBird;
  	game.city.move = this.scroll;
  	console.log(game.bird)
  },
  moveBird : function(game)
  {
  	if(this.moveY == 0)
  	{
  		this.speed -= this.speed > 0 ? this.velocity : -this.velocity
  		if(Math.sqrt(this.speed * this.speed) < this.velocity)this.speed = 0;
  	}
  	else
  	{
  		this.speed = this.rapidity * this.moveY;
  	}
  	this.y += game.gravity - this.wingForce;
  	this.wingForce = 0.3;
    if(!!this.animationEnded)
      this.alpha = 0;
  },
  scroll : function(game)
  {
  	game.speed = !!this.speedUp ? game.speed < 24 ? game.speed * 1.01 : 24 : game.speed > 2 ? game.speed /= 1.01 : 2;
  	if(game.speed > 6)
  		game.shaker.play(game.speed / 12);
  	this.x -= game.speed * this.howFar;
  },
  manageDude : function(game)
  {
  	this.x -= game.speed;
  	if(this.y > 0 && game.bird.x + game.bird.tileW / 3 > this.x && game.bird.x + game.bird.tileW / 3 < this.x + this.tileW)
  	{
  		game.bird.wingForce = (game.bird.y + game.bird.tileH - this.y)/10;
  	}
  	this.fire.x = this.x + 40;
    var c = this.collideBox;
    var C = game.bird.collideBox;
    if(c[0] < C[0] + C[2] && c[0] + c[2] > C[0] && c[1] < C[1] + C[3] && c[1] + c[3] > C[1] && game.bird.currentAnimation != 'death')
    {
      this.colliding = true;
      game.animations.play(game.bird, 'death', false);
      game.manager.over(game)
    }
    else
    {
      this.colliding = false;
    }
  },
  over : function(game)
  {
    game.textOver = game.write('Game Over', 200, 10, 15, "#FFFFFF");
    game.textOver.draw(game)
    game.bird.isDead = true;
  }
}