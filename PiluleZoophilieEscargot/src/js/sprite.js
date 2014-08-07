function Sprite()
{

}

Sprite.prototype =
{
  alpha : 1,
  draw : function(game)
  {
    var i = this.tiles[this.frame];
    game.context.globalAlpha = this.alpha;
    game.context.drawImage(this.image, i.x * this.tilewidth, i.y * this.tileheight, this.tilewidth, this.tileheight,  this.x, this.y, this.tilewidth * this.ratio, this.tileheight * this.ratio);
    game.context.globalAlpha = 1;
    if(!!this.animated && game.frameCounter % this.fps == 0)
      this.animate(game)
    if(this.manager)
      this.manager(game)
  },
  animate : function(game)
  {
    this.frame = (this.frame == this.tiles.length - 1) ? 0 : this.frame + 1;
  }
}
