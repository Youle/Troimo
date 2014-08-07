function Menu()
{

}

Menu.prototype =
{
  manage : function(game)
  {
    this.render(game)
  },
  render : function(game)
  {
    var a = this.test.length;
    for(var i = 0; i < a; i++)
    {
      var b = this.test[i].length - 1;
      game.context.fillStyle = this.test[i][b]
      for(var j = 0; j < b; j++)
      {
        var c = this.test[i][j].length;
        for(var k = 0; k < c; k++)
        {
          var d = this.test[i][j][k];
          game.context.fillRect(d[0], d[1], d[2], d[3])
        }
      }
    }

  }
}
