
/* Mary global information */
var mary_host = "localhost";
var mary_port = "59125";

var current_voice = 0;
var current_locale = 0;
var region_map = {};

/***********************************************************************************
 ** Listing
 ***********************************************************************************/

function listLocales()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/listLocales";
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var current_language = current_locale.split("_")[0];
            
            var result = JSON.parse(xmlhttp.responseText)['result'];
            
            var locales = document.getElementById('locales_area');
            var select_language = document.createElement("select");
            select_language.name = "languages";
            select_language.id = "languages";
            select_language.size = 5;
            locales.appendChild(select_language);
            locales.appendChild(document.createElement("br"));
            
            var len=result.length;
            var prev_language = "";
            for(var i=0; i<len; i++)
            {

	            var value = result[i];
                var elts = value.split("_");
                var language = elts[0];
                var region = elts[0];
                if (elts.length > 1)
                {
                    region = elts[1];
                }

                if (language != prev_language)
                {
                    var opt = document.createElement('option');
                    opt.value = language;
                    opt.innerHTML = language;
                    if (language == current_language)
                    {
                        opt.selected = true;
                    }
                    
                    document.getElementById('languages').appendChild(opt);
                    prev_language = language;
                }
                
                if (language == current_language)
                {
                    var radio_item = document.createElement("input");
		            radio_item.type = "radio";
		            radio_item.name = "region";
		            radio_item.id = value;
		            radio_item.value = value;
                    
                    if (value == current_locale)
                    {
		                radio_item.checked = true;
                    }

		            var text_node = document.createTextNode(region);
                    
                    
		            var label = document.createElement("label");
		            label.appendChild(radio_item);
		            label.appendChild(text_node);
                    
                    locales.appendChild(label);
                }
            }
        }
    }
}

function listVoices()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/listVoices";
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true); // FIXME: add locale !
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var result = JSON.parse(xmlhttp.responseText)['result'];
            var select = document.getElementsByName("voices")[0];
            select.options.length = 0;
            var len=result.length;
            for(var i=0; i<len; i++) {
	            var value = result[i];
                var opt = document.createElement('option');
                opt.value = value;
                opt.innerHTML = value;
                if (value == current_voice)
                {
                    opt.selected = true;
                }
                select.appendChild(opt);
            }
    
        }
    }
}

/***********************************************************************************
 ** Initialisation
 ***********************************************************************************/
function getCurrentLocale()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/getCurrentLocale";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            current_locale = JSON.parse(xmlhttp.responseText)['result'];
            listLocales();
        }
    }
}


function getCurrentVoice()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/getCurrentVoice";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            current_voice = JSON.parse(xmlhttp.responseText)['result'];
            listVoices();
        }
    }
}

function initialisation()
{
    getCurrentLocale();
    getCurrentVoice();
}


/***********************************************************************************
 ** Setters
 ***********************************************************************************/
function selectVoice()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/setVoice";

    var voice = document.getElementById('voices').value;
    
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url + "?voice=" + voice, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            current_locale = JSON.parse(xmlhttp.responseText)['result'];
            listLocales();
        }
    }
}

function setOutputLevel()
{
            
    // var base_url = "http://" + mary_host + ":" + mary_port + "/setLoggerLevel";
    
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.open("GET", base_url, true);
    // xmlhttp.send();

    
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         current_locale = JSON.parse(xmlhttp.responseText)['result'];
    //         listLocales();
    //     }
    // }
}
