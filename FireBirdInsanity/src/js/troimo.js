window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();
var Troimo = Troimo || {};

Troimo.tool = {
  getJSON : function(url)
  {
    var responseText = httpGet(url);
    var config = JSON.parse(responseText);
    var conf = {}

    for(key in config)
    {
      if(config[key].url === undefined)
      {
        for(subkey in config[key])
        {
          config[key][subkey] = JSON.parse(this.getJSONDatas(config[key][subkey].url))
        }
      }

      else
      {
        config[key] = JSON.parse(this.getJSONDatas(config[key].url))
      }
    }
    return config;
  },
  getJSONDatas : function(url, unit)
  {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    if(unit)
      return JSON.parse(xmlHttp.responseText)
    return xmlHttp.responseText;
  }
}

Troimo.config =
{
  toGet : {
    type : "src/json/type.json"
  }
}

Troimo.Type = function(game, entry, x, y, fontSize, color)
{
  var x = x || 120;
  var y = y || 120;
  this.alpha = 1;
  this.group = [];
  this.fontSize =  fontSize || 4;
  this.color = color || "#000000";
  for(var i = 0; i < entry.length; i++)
  {
    for(type in game.config.type.alphabet)
    {
      for(letter in game.config.type.alphabet[type])
      {
        if(entry[i] == letter)
        {
          if(type == "rising"){
            this.drawLetter(game, x, y, type, entry[i])
          }

          else
            this.drawLetter(game, x, y + this.fontSize * 3, type, entry[i]);

          x += game.config.type.alphabet[type][letter][0].length * this.fontSize + this.fontSize
        }
        else if(entry[i] == " "){x+= this.fontSize / 12;}
      }
    }
  }
  game.toRender.displayObject.push(this);
}

Troimo.Type.prototype =
{
  drawLetter : function(game, x, y, type, letter)
  {
    var subGroup = [];

    var configLetter = game.config.type.alphabet[type][letter];

    for(var i = 0; i < configLetter.length; i++)
    {
      for(var j = 0; j < configLetter[i].length; j++)
      {
        if(configLetter[i][j])
        {
         // console.log(j, x)
          var graphics = [(this.fontSize) * j + x, (this.fontSize) * i + y, this.fontSize, this.fontSize];
          this.group.push(graphics);
        }
      }
    }
    
  },
  draw : function(game)
  {
    game.context.fillStyle = this.color;
    for(var i = 0; i < this.group.length; i++)
    {
      var letter = this.group[i];
      var x = game.x + letter[0], y = game.y + letter[1], wh = this.fontSize;
      game.context.fillRect(x, y, wh, wh);
    }
  }
}

Troimo.Type.prototype.constructor = Troimo.Type;

Object.defineProperty(Troimo.Type, "fontSize", {

  get: function () {
    return this.fontSize;
  },

  set: function (value) {

    if (value > 0)
    {
      this.fontSize = value;
    }
  }
});

Troimo.Game = function(functions)
{
  if(!functions){
    console.warn('Tu devrais renseigner une fonction comme init ou manager new Troimo.Game({manager : maFonction}) par exemple')
    return;
  }
  var c = document.getElementById('troimo');
  console.log(c)
  this.width = c.width;
  this.height = c.height;
  this.toRender = {
    images : {},
    displayObject : []
  }
  this._hidden = {
    imagesToLoad : 0,
    imageLoaded : 0
  }
  this.x = 0;
  this.y = 0;
  this.second = {};
  
  for(key in functions)
  {
      var sTmp = key.charAt(0).toUpperCase() + key.slice(1);
      if(Troimo[sTmp]){
        for(method in functions[key].prototype)
        {
          var meth = method;
          if(Troimo[sTmp].prototype[method]){
            meth = "user" + meth;
            console.warn('La methode ' + method + ' écraserait la methode de Troimo, elle a donc été changée par ' + meth)
          }
          Troimo[sTmp].prototype[meth] = functions[key].prototype[method];
        }
      }
      else
      {
        this.second[key] = functions[key];
      }
  }

  this.config = {};
  
  this.preload();
}

Troimo.Game.prototype =
{
  preload : function()
  {
    var game = this
    if(this.second.preload)
      this.second.preload(this);
    for(var i in this.toRender.images)
    {
      this.toRender.images[i].onload = function()
      {
        game._hidden.imageLoaded++
        if(game._hidden.imageLoaded == game._hidden.imagesToLoad);
          game.init()
      }
      this.add.parent = this;
    }
  },
  init : function()
  {
    /*
    * INITIALISATION DE LA CONFIG
    */
    this.context = document.getElementById('troimo').getContext('2d');
    for(key in Troimo.config.toGet)
    {
      var value = Troimo.config.toGet[key];
      this.config[key] = Troimo.tool.getJSONDatas(value, true);
    }
    this.manager = new Troimo.Manager(this.second.manager)
    if(this.second.init)
      this.second.init(this);

    this.render()
  },
  background : {
    color : "#DFDFDF",
    draw : function(game)
    {
      game.context.fillStyle = this.color;
      game.context.fillRect(0, 0, game.width, game.height);  
    }
  },
  write : function(text, x, y, fontSize, color)
  {
    if(!this.config.type){
      console.warn('It seems I had some problems loading src/json/type.json');
      return
    }
    return new Troimo.Type(this, text, x, y, fontSize, color);
  },
  render : function()
  {
    var that = this;
    this.background.draw(this);
    for(key in this.toRender)
    {
      if(Array.isArray(this.toRender[key]))
      {
        var ar = this.toRender[key]
        for(var i = 0; i < ar.length; i++)
        {
          ar[i].draw(this)
        }
      }
      else if(typeof this.toRender[key] === "object")
      {
        for(i in this.toRender[key])
        {
          this.toRender[key][i].draw(this)
        }
      }
    }
    if(!!this.shaker.shaga)
      this.shaker.main(this);
    if(this.second.render)
      this.second.render(this);
    requestAnimFrame(function(){that.render()});
  },
  shaker : {
    index : 0,
    play : function(index, quickness)
    {
      this.index = index || 5;
      this.quickness = quickness || 0.5;
      this.shaga = true;
    },
    main : function(game)
    {
      var sX = Math.random() * this.index + this.index;
      var sY = Math.random() * this.index + this.index;
      this.index -= this.quickness;
      game.x = (Math.random() > 0.5) ? sX : -sX;
      game.y = (Math.random() > 0.5) ? sY : -sY;
      if(this.index <= 0)
      {
        this.shaga = false;
        game.x = game.y = 0
      }
    }
  },
  add : {
    image : function()
    {

    },
    spritesheet : function(name, tileW, tileH)
    {
      var i = this.parent.toRender.images[name];
      if(!i)
      {
        console.error('Name of the image you gave isn\'t exist')
        return
      }
      i.nbFrame = {
        w : i.width / tileW,
        h : i.height / tileH
      }
      if(i.nbFrame.w % 1  !== 0 || i.nbFrame.h % 1 !== 0)
        console.warn('The tilesize you gave isn\'t appropriate to the image width, it could cause animations problems');

      i.type = "spritesheet";
      i.tileW = tileW;
      i.tileH = tileH;
      i.frames = 0
      this.parent.toRender.images[name] = i;
    },
    tilemap : function(name, src, tileW, tileH)
    {

    },
    animation : function(name, firstTile, nbTiles, fps, loop)
    {
      
    }
  },
  load : {
    image : function(game, name, src)
    {
      var i = new Image()
      i.src = src
      i.name = name
      game.toRender.images[name] = i;
      game._hidden.imagesToLoad++;
    }
  },
  get : {
    imageData : function(i)
    {
      console.log(i.tileW)
      return {
        x : i.x || 0,
        y : i.y || 0,
        width : i.tileW || i.width,
        height : i.tileH || i.height,
        nbFrame : i.nbFrame || {w : 1, h : 1},
        ratio : i.ratio || 1,
        frame : i.frame || [0, 0]
      }
    }
  }
}

Troimo.Game.prototype.constructor = Troimo.Game;

Troimo.Manager = function(second)
{

}

Troimo.Manager.prototype =
{
  mine : function()
  {

  }
}
Troimo.Manager.prototype.constructor = Troimo.Manager;

Image.prototype = 
{
  draw : function(game)
  {
    var d = game.get.imageData(this);
    
    this.frames++
    game.context.drawImage(this, d.frame[0] * d.width, d.frame[1] * d.height, d.width, d.height, d.x, d.y, d.width * d.ratio, d.height * d.ratio)
    if(this.animations.length > 0)
      this.animate(game)
  },
  animate : function(game)
  {
    
  }
}
