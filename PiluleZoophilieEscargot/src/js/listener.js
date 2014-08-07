function listener(game, e)
{
  var hotKeys = [38, 233, 34, 39, 40, 45];
  // Prevent VERR MAJ || QWERTY
  if(e.keyCode >= 49 && e.keyCode <= 54)
  {
    game.manager.checkKey(game, e.keyCode - 49);
  }
  // Prevent AZERTY
  else
  {
    for(var i = 0; i < hotKeys.length; i++)
    {
      if(hotKeys[i] == e.keyCode)
        game.manager.checkKey(game, i)
    }
  }
}
