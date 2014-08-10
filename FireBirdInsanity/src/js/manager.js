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
  	this.wingForce = 0.3
  },
  scroll : function(game)
  {
  	game.speed = !!this.speedUp ? game.speed < 24 ? game.speed * 1.01 : 24 : game.speed > 2 ? game.speed /= 1.01 : 2;
  	if(game.speed > 6)
  		game.shaker.play(game.speed / 6);
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
  }
}