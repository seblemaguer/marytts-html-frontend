function loadjscssfile(filename, filetype, initialisationCallBack){
	if (filetype=="js"){ //if filename is a external JavaScript file
		var script=document.createElement('script');
		script.setAttribute("type","text/javascript");
		script.setAttribute("src", filename + ".js");
        script.onreadystatechange= function () {
            if (this.readyState == 'complete') window[initialisationCallBack]();
        };
        script.onload = function () {
            window[initialisationCallBack]();
        };
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var script=document.createElement("link");
		script.setAttribute("rel", "stylesheet");
		script.setAttribute("type", "text/css");
		script.setAttribute("href", filename + ".css");
	}
    
	if (typeof script!="undefined")
		document.getElementsByTagName("head")[0].appendChild(script);
}

function switchTo(name)
{
    $("#content").load("include/" + name +"/index.html");
    loadjscssfile("include/" + name +"/style", "css");
    loadjscssfile("include/" + name +"/events", "js", "initialisation_" + name);
}


function initialisation() {
    var list_modes = ["demo", "expert"];
    
    for (var id_mode in list_modes)
    {
        var mode = list_modes[id_mode];
        var radio_item = document.createElement("input");
		radio_item.type = "radio";
        radio_item.name = "interface_mode";
        radio_item.id = mode;
        radio_item.value = mode;
        if (mode == "demo") {
            radio_item.checked = true;
        }
        radio_item.onchange = function () {switchTo(this.id);};

		var text_node = document.createTextNode(mode);
		var label = document.createElement("label");
		label.appendChild(radio_item);
		label.appendChild(text_node);
        document.getElementById("interface_switch").appendChild(label);

    }
    
    // At least the demo !
    switchTo('demo');
}
