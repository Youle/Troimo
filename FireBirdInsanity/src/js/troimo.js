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
  this.frame = 0;
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
        if(game._hidden.imageLoaded == game._hidden.imagesToLoad){
          game.init();
        }
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
    if(this.second.init)
      this.second.init(this);

    this.render();
  },
  background : {
    color : "#0d0f12",
    alpha : 1,
    draw : function(game)
    {
      game.context.fillStyle = this.color;
      game.context.globalAlpha = this.alpha || 1
      game.context.fillRect(0, 0, game.width, game.height);
      game.context.globalAlpha = 1;
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
      /*if(Array.isArray(this.toRender[key]))
      {
        var ar = this.toRender[key]
        for(var i = 0; i < ar.length; i++)
        {
          ar[i].draw(this)
        }
      }*/
      /*else if(typeof this.toRender[key] === "object")
      {
        for(i in this.toRender[key])
        {
          this.toRender[key][i].draw(this)
        }
      }*/
    }
    if(!!this.shaker.shaga)
      this.shaker.main(this);
    if(this.second.render)
      this.second.render(this);
    requestAnimFrame(function(){that.render()});
  },
  animations : {
    play : function(parent, key, loop)
    {
      if(!parent.animations[key])
      {
        console.error(parent.key + ' hasn\'t animation named ' + key);
        return;
      }

      parent.loop = loop === false ? false : true;
      if(key == 'death')
        console.log(parent.loop)
      parent.animations[key].frame = parent.animations[key].firstFrame || 0;
      parent.frame[1] = Math.floor(parent.animations[key].frame / parent.nbFrame.w);
      parent.frame[0] = parent.animations[key].frame - parent.frame[1] * parent.nbFrame.w;
      parent.currentAnimation = key;
    }
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
    spritesheet : function(name, tileW, tileH, d)
    {
      var d = d || {}
      var im = this.parent.toRender.images[name];
      var i = {}
      if(!i)
      {
        console.error('Name of the image you gave isn\'t exist')
        return
      }
      i.nbFrame = {
        w : im.width / tileW,
        h : im.height / tileH
      }
      if(i.nbFrame.w % 1  !== 0 || i.nbFrame.h % 1 !== 0)
        console.warn('The tilesize you gave isn\'t appropriate to the image width, it could cause animations problems');

      i.type = "spritesheet";
      i.tileW = tileW;
      i.tileH = tileH;
      i.frames = 0;
      i.x = 0;
      i.y = 0;
      i.fps = 7;
      i.image = im;
      i.ratio = 1;
      for(k in d)
      {
        i[k] = d[k]
      }

      return new Troimo.Image(this.parent, name, i)
    },
    tilemap : function(name, tileW, tileH, map)
    {
      var im = this.parent.toRender.images[name];
      var i = {}
      if(!i)
      {
        console.error('Name of the image you gave isn\'t exist')
        return
      }
      i.nbFrame = {
        w : im.width / tileW,
        h : im.height / tileH
      }
      if(i.nbFrame.w % 1  !== 0 || i.nbFrame.h % 1 !== 0)
        console.warn('The tilesize you gave isn\'t appropriate to the image width, it could cause animations problems');

      i.type = "tilemap";
      i.tileW = tileW;
      i.tileH = tileH;
      i.frames = 0;
      i.x = 0;
      i.y = 0;
      i.image = im;
      i.map = map;

      return new Troimo.Tilemap(this.parent, name, i)
    },
    animation : function(parent, key, firstFrame, nbFrame, fps)
    {
      if(!parent.animations)
        parent.animations = {}
      parent.animations[key] = new Troimo.Animation(this.parent, key, firstFrame, nbFrame, fps);
    }
  },
  load : {
    image : function(game, name, src)
    {
      var i = new Image()
      i.src = src
      i.name = name
      i.x = 200;
      i.y = 200;
      game.toRender.images[name] = i;
      game._hidden.imagesToLoad++;
    }
  },
  get : {
    imageData : function(game, i)
    {
      var d = i.disableShake ? 1 : i.howFar ? game.x * i.howFar : game.x;
      return {
        x : d + i.x,
        y : d + i.y,
        width : i.tileW || i.image.width,
        height : i.tileH || i.image.height,
        nbFrame : i.nbFrame || {w : 1, h : 1},
        ratio : i.ratio || 1,
        frame : i.frame || [0, 0],
        ratio : i.ratio || 1
      }
    }
  }
}
Troimo.Game.prototype.constructor = Troimo.Game;

Troimo.Tilemap = function(game, name, i)
{
  for(var k in i)
  {
    this[k] = i[k]
  }
  this.dimensions = this.getDimensions();
}
Troimo.Tilemap.prototype = 
{
  getDimensions : function(m)
  {
    return typeof this.map[0] === "number" ? 1 : 2;
  },
  draw : function(game, isTwo, index)
  {
    var index = index || 0;
    for(var i = 0; i < this.map.length; i++)
    {
      if(this.dimensions == 1 || !!isTwo)
      {
        var s = {x : this.tileW * this.map[i], y : 0}
        game.context.globalAlpha = this.alpha || 1
        game.context.drawImage(this.image, s.x, s.y, this.tileW, this.tileH, i * this.tileW + this.x, index * this.tileH + this.y, this.tileW, this.tileH);
        game.context.globalAlpha = 1;
      }
      else
      {
        this.draw(game, true, i);
      }
    }
  }
}

Troimo.Tilemap.prototype.constructor = Troimo.Tilemap;
Troimo.Image = function(game, name, i)
{
  for(var key in i)
  {
    this[key] = i[key];
  }
  this.frame = [0, 0]
  this.key = name;
  this.parent = game;
  this.add.parent = this;
}
Troimo.Image.prototype = 
{
  draw : function(game)
  {
    var d = game.get.imageData(game, this);
    this.frames++
    game.context.globalAlpha = this.alpha || 1;
    game.context.drawImage(this.image, d.frame[0] * d.width, d.frame[1] * d.height, d.width, d.height, d.x, d.y, d.width * d.ratio, d.height * d.ratio);
    game.context.globalAlpha = 1
    if(this.animations)
      this.animate(game)
  },
  animate : function()
  {
    if(!this.currentAnimation || this.currentAnimation == "")
      return
    var a = this.animations[this.currentAnimation];
    if(this.frames % a.fps == 0) 
      a.frame++
    if(a.frame >= this.nbFrame.h * this.nbFrame.w || a.frame >= a.nbFrame)
    {
      if(this.key == 'bird' && this.currentAnimation == "death")
        console.log(this.loop)
      if(!!this.loop)
        a.frame = a.firstFrame || 0;
      else
        this.animationEnded = true;
    }
    this.frame[1] = Math.floor(a.frame / this.nbFrame.w);
    this.frame[0] = a.frame - this.frame[1] * this.nbFrame.w;
  },
  add : {
    
  }
}
Troimo.Image.prototype.constructor = Troimo.Image;

Troimo.Animation = function(parent, key, fF, nF, fps)
{
  this.key = key;
  this.firstFrame = fF;
  this.nbFrame = nF;
  this.frame = fF || 0;
  this.fps = fps || 7;
}