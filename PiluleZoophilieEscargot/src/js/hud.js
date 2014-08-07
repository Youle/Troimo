function HUD(game)
{
  this.x = 250;
  this.y = game.height - 100;
  this.width = 616;
  this.height = 32;
  this.pills = [];
  for(var i = 0; i < 6; i++)
  {
    this.pills.push(new Pill(game, this.x, this.y, i))
  }
  this.cursor = {}
  this.cursor.x = 512;
  this.speed = 8;
  this.fps = 10;
}

HUD.prototype =
{
  display : function(game)
  {
    for(var i = 0; i < this.pills.length; i++)
    {
      this.pills[i].draw(game);
    }
  }
}
