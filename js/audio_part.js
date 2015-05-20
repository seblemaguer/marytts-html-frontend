'use strict';

// Create an instance
var wavesurfer = Object.create(WaveSurfer);


// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
    var options = {
        container     : document.querySelector('#waveform'),
        // FIXME: see for the scrollbar
        // fillParent    : false,
        // minPxPerSec   : 2000,
        waveColor     : '#587d9d',
        progressColor : '#97c7de',
        height:200,
        cursorColor   : 'red'
    };

    if (location.search.match('scroll')) {
        options.minPxPerSec = 100;
        options.scrollParent = true;
    }

    // Init
    wavesurfer.init(options);

    // Regions
    if (wavesurfer.enableDragSelection) {
        wavesurfer.enableDragSelection({
            color: 'rgba(0, 255, 0, 0.1)'
        });
    }
});

// Play at once when ready
// Won't work on iOS until you touch the page
wavesurfer.on('ready', function () {
    wavesurfer.play();
});

// Report errors
wavesurfer.on('error', function (err) {
    console.error(err);
});

// Do something when the clip is over
wavesurfer.on('finish', function () {
    console.log('Finished playing');
});


/* Progress bar */
document.addEventListener('DOMContentLoaded', function () {
    var progressDiv = document.querySelector('#progress-bar');
    var progressBar = progressDiv.querySelector('.progress-bar');

    var showProgress = function (percent) {
        progressDiv.style.display = 'block';
        progressBar.style.width = percent + '%';
    };

    var hideProgress = function () {
        progressDiv.style.display = 'none';
    };

    wavesurfer.on('loading', showProgress);
    wavesurfer.on('ready', hideProgress);
    wavesurfer.on('destroy', hideProgress);
    wavesurfer.on('error', hideProgress);
});

// // Drag'n'drop
// document.addEventListener('DOMContentLoaded', function () {
//     var toggleActive = function (e, toggle) {
//         e.stopPropagation();
//         e.preventDefault();
//         toggle ? e.target.classList.add('wavesurfer-dragover') :
//             e.target.classList.remove('wavesurfer-dragover');
//     };

//     var handlers = {
//         // Drop event
//         drop: function (e) {
//             toggleActive(e, false);

//             // Load the file into wavesurfer
//             if (e.dataTransfer.files.length) {
//                 wavesurfer.loadBlob(e.dataTransfer.files[0]);
//             } else {
//                 wavesurfer.fireEvent('error', 'Not a file');
//             }
//         },

//         // Drag-over event
//         dragover: function (e) {
//             toggleActive(e, true);
//         }

//         // Drag-leave event
//         dragleave: function (e) {
//             toggleActive(e, false);
//         }
//     };

//     var dropTarget = document.querySelector('#drop');
//     Object.keys(handlers).forEach(function (event) {
//         dropTarget.addEventListener(event, handlers[event]);
//     });
// });

/*************************************************************************************************
 ** Marytts
 *************************************************************************************************/
function play (){
    wavesurfer.play();
}


function synth () {
    var base_url = "http://" + mary_host + ":" + mary_port + "/synthesize";

    //
    var input_text  = document.getElementsByName("text_to_synth")[0].value;
    var input_type  = "TEXT";
    var output_type = "AUDIO";
    var locale = "en_US";
    var audio = "WAVE_FILE";

    if (input_text.length == 0)
    {
        alert('text needs to be defined !');
        throw new Error('text needs to be defined !');
    }
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url + "?text='" + input_text + "'", true);
    xmlhttp.send();



    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var result = JSON.parse(xmlhttp.responseText);
            
            // Change the output level
            if (! document.getElementById('none').checked)
            {
                document.getElementById('debug_area').style.display = 'inline';
                // document.getElementsByName('debug')[0].value = result['result'];
            }
            else
            {
                document.getElementById('debug_area').style.display = 'none';
            }

            // Get signal
            var xmlhttp_signal = new XMLHttpRequest();
            xmlhttp_signal.open("GET", "http://" + mary_host + ":" + mary_port + "/getSynthesizedSignal", true);
            xmlhttp_signal.responseType = 'blob';
            xmlhttp_signal.send();

            
            xmlhttp_signal.onload = function() {
                if (xmlhttp_signal.status == 200) {
                    
                    // if (! document.getElementById('none').checked)
                    // {
                    //     document.getElementsByName('debug')[0].value = xmlhttp_signal.responseText;
                    // }
                    wavesurfer.loadBlob(xmlhttp_signal.response);
                }
            }
        }
    }
}
