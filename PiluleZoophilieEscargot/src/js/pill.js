function Pill(game, x, y, i, s)
{
  for(k in game.config.pills)
  {
    this[k] = game.config.pills[k]
  }
  this.frame = i
  this.x = s ? x : x + i * (this.tilewidth+ 8);
  this.ratio = s ? 0.5 : 1
//  this.x = x + i * (this.tilewidth+ 8);
  this.y = y;
  this.initDatas = {
    x : x,
    y : y
  }
  this.image = new Image()
  this.image.src = game.config.pills.src;
  
  this.init();
}

//Object.create(Sprite.prototype);
Pill.prototype = {
    init : function()
    {
      for(p in Sprite.prototype)
      {
        this[p] = Sprite.prototype[p];
      }

    },
    select : function(game)
    {
      this.y-= 3;
      this.alpha -= 0.08;
      if(this.alpha < 0){
        this.reinitialize();
      }
    },
    manager : function(game)
    {
      if(!!this.selected)
      {
        this.select(game);
      }
    },
    reinitialize : function()
    {
      this.alpha = 1
      this.selected = false;
      this.y = this.initDatas.y
    }
}
// Pill.prototype.constructor = Pill;
