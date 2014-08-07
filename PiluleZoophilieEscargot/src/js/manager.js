function Manager(game)
{

}

Manager.prototype =
{
  newSnails : function(game)
  {
    var nSnails = []
    for(var i = 1; i < 8; i++)
    {
      var dis = this.genDis(game)
      nSnails.push(new Snail(game, i, dis))
    }
    game.snails.push(nSnails);
  },
  checkKey : function(game, i)
  {
    var pill = game.hud.pills[i];
    if(!!pill.selected)
      pill.reinitialize();
    pill.selected = true;
    this.isWellPlayed(game, i);
  },
  isWellPlayed : function(game, key)
  {
    var col = game.snails[game.pointer[0]],
        s = col[game.pointer[1]];
    if(s.disease == key)
    {
      s.makeSafe();
      this.isLastofCol(game, col);
      game.stats.safed++
      if(game.state == "menu")
      {
        game.state = "play";
        game.speed = 0.3
      }
    }
    else if(game.state == "play")
    {
      s.makeMad(game)
      game.stats.mad++
    }
  },
  isLastofCol : function(game, col)
  {
    if(game.pointer[1] == col.length - 1)
    {
      this.newSnails(game);
      col.each(function(s){this.speed = 2})
      game.pointer[0]++;
      game.pointer[1] = 0;
      game.speed += 0.3
    }
    else
    {
      game.pointer[1]++;
    }
  },
  genDis : function(game)
  {
    return Math.round(Math.random() * game.difficulty)
  },
  gameOver : function(game)
  {
    game.state = "menu"
  }
}

Array.prototype.each = function(callback, callbackContext)
{
  for (var i = 0; i < this.length; i++)
  {
    callback.apply(this[i]);
  }
}
