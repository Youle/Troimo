function WordTyper(game, defCol, defSize)
{
	this.defaultColor = defCol || "#FFFFFF";
	this.defaultSize = defSize || 4;
}

WordTyper.prototype = {
	typethis : function(game, entry, x, y, fontSize, color)
	{
		this.group = [];
		this.fontSize = fontSize || this.defaultSize;
		this.color = color || this.defaultColor;
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

						x += game.config.type.alphabet[type][letter][0].length * fontSize + fontSize
					}
					else if(entry[i] == " "){x+= this.fontSize / 12;}
				}
			}
		}
		this.group.push(this.color);
		return this.group;
	},
	drawLetter : function(game, x, y, type, letter)
	{
		this.subGroup = [];

		var configLetter = game.config.type.alphabet[type][letter];

		for(var i = 0; i < configLetter.length; i++)
		{
			for(var j = 0; j < configLetter[i].length; j++)
			{
				if(configLetter[i][j])
				{
					var graphics = [(this.fontSize) * j + x, (this.fontSize) * i + y, this.fontSize, this.fontSize];
    				this.subGroup.push(graphics);
				}
			}
		}
		this.group.push(this.subGroup)
	}
}
