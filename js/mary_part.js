
/* Mary global information */
var mary_host = "localhost";
var mary_port = "59125";

var current_voice = 0;
var current_locale = 0;

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

function listLocales()
{
        
    var base_url = "http://" + mary_host + ":" + mary_port + "/listLocales";
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            
            var result = JSON.parse(xmlhttp.responseText)['result'];
            
            var locales = document.getElementById('locales_area');
            // radioFragment.innerHTML = "";
            var len=result.length;
            for(var i=0; i<len; i++) {

	            var value = result[i];
                var radio_item = document.createElement("input");
		        radio_item.type = "radio";
		        radio_item.name = "locale";
		        radio_item.id = value;
		        radio_item.value = value;

                if (value == current_locale) {
		            // radioItem1.defaultChecked = true; 
		            radio_item.checked = true;
                }

		        var text_node = document.createTextNode(value);
                
                
		        var label = document.createElement("label");
		        label.appendChild(radio_item);
		        label.appendChild(text_node);
                
                locales.appendChild(label);
            }
    
        }
    }
}

function listVoices() {
    
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

function initialisation() {
    getCurrentLocale();
    getCurrentVoice();
}
