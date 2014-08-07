// Récupération des données JSON
function httpGet(url) {
        var xmlHttp = null;
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
}

function httpGetData(url) {
    var responseText = httpGet(url);
    var config = JSON.parse(responseText);
    var conf = {}
    // Cette boucle permet d'aller chercher les fichiers de filesReffering.json aussi loin dans la hiérarchie soit-il
    // Par exemple : il récupère build, voit qu'il a un enfant, donc va le chercher build.towers et build.baddies, et chacun de ceux la auraient pu avoir des sous fichiers.
    for(key in config)
    {
    	if(config[key].url === undefined)
    	{
	    	for(subkey in config[key])
	    	{
	    		config[key][subkey] = JSON.parse(httpGet(config[key][subkey].url))
	    	}
    	}

    	else
    	{
    		config[key] = JSON.parse(httpGet(config[key].url))
    	}
    }
    return config;
}
