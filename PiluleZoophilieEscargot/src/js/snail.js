function Snail(game, y, dis)
{
  this.state = "waiting";
  for(k in game.config.snails)
  {
    this[k] = game.config.snails[k]
  }
  this.x =  8;
  this.y = (y - 1) * 64;
  this.image = new Image()
  this.image.src = game.config.snails.src;
  this.disease = dis;
  this.pill = new Pill(game, this.x, this.y, this.disease, true)
  this.init();
  this.speed = 0;
  this.mad = "src/img/snailB.png"
}

Snail.prototype = {
    init : function()
    {
      for(p in Sprite.prototype)
      {
        this[p] = Sprite.prototype[p];
      }
    },
    manager : function(game)
    {
      this.pill.x = this.x
      this.pill.y = this.y
      this.pill.draw(game);
      this.move(game)
    },
    move : function(game)
    {
      this.x += this.speed + game.speed;
      if(this.x + this.tilewidth - 64 > game.deadLine.x && !this.safed && !this.isMad){
        this.makeMad(game);
        game.manager.gameOver(game);
      }
    },
    makeMad : function(game)
    {
      this.speed = 0.5;
      this.image.src = this.mad;
      this.isMad = true;
    },
    makeSafe : function()
    {
      this.safed = true;
      this.pill.alpha = 0.2;
      if(!!this.isMad)
      {
        this.speed = 0;
        this.image.src = this.src;
      }
    }
}
