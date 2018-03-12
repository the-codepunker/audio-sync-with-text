var audioSync = function (options) {

    var audioPlayer = document.getElementById(options.audioPlayer);
    var subtitles = document.getElementById(options.subtitlesContainer);
    var syncData = [];
    var rawSubTitle = "";
    var convertVttToJson = require('vtt-json');

    var init = function() {
        return fetch(new Request(options.subtitlesFile))
                .then(response => response.text())
                .then(createSubtitle)
    }();

    function createSubtitle(text)
    {
        var rawSubTitle = text;
        convertVttToJson(text)
        .then((result) => {
            var x = 0;
            for (var i = 0; i < result.length; i++) { //cover for bug in vtt to json here
                if (result[i].part && result[i].part.trim() != '') {
                    syncData[x] = result[i];
                    x++;
                }
            }
        });
    }

    audioPlayer.addEventListener("timeupdate", function(e){
        syncData.forEach(function(element, index, array){
            var el;
            if( (audioPlayer.currentTime*1000) >= element.start && (audioPlayer.currentTime*1000) <= element.end ) {

                while(subtitles.hasChildNodes())
                    subtitles.removeChild(subtitles.firstChild)

                el = document.createElement('span');
                el.setAttribute("id", "c_" + index);
                el.innerText = syncData[index].part + "\n";
                el.style.background = 'yellow';
                subtitles.appendChild(el);


            }
        });
    });
}

module.exports = audioSync;
