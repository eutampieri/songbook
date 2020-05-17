var song_sort = sortSongsByAuthor;

function onLoad() {
    // Songs order
    var radio_sort = document.getElementsByName("songsOrder");
    for(i=0;i<radio_sort.length;i++) {
        console.log(radio_sort[i].value+", "+songbook.sort)
        if(radio_sort[i].value == songbook.sort) {
            radio_sort[i].checked = "checked";
            if(radio_sort[i].value == "Author")
                song_sort = sortSongsByAuthor;
            else if(radio_sort[i].value == "Title")
                song_sort = sortSongsByTitle;
            break;
        }
    }
    // Lang chords
    var radio_lang = document.getElementsByName("langChords");
    for(i=0;i<radio_lang.length;i++) {
        console.log(radio_lang[i].value+", "+songbook.lang)
        if(radio_lang[i].value == songbook.lang) {
            radio_lang[i].checked = "checked";
        }
    }
    // Font style IS NOT WORKING
    var font_option = document.getElementById("font-style");
    font_option.value = songbook.font;
}

function sortSongsByTitle(a, b) {
    if(a.title > b.title) return 1;
    else if(a.title < b.title) return -1;
    if(a.artist > b.artist) return 1;
    else if(a.artist < b.artist) return -1;
    else return 0;
}

function sortSongsByAuthor(a, b) {
    if(a.artist > b.artist) return 1;
    else if(a.artist < b.artist) return -1;
    if(a.title > b.title) return 1;
    else if(a.title < b.title) return -1;
    else return 0;
}

function changeSongsOrder() {
    var radio = document.getElementsByName("songsOrder");
    for (var i=0;i<radio.length;i++)
        if (radio[i].checked)
            if(radio[i].value == "Author") {
                song_sort = sortSongsByAuthor;
                songbook.sort = "Author";
            }
            else {
                song_sort = sortSongsByTitle;
                songbook.sort = "Title";
            }
            songbook.songs.sort(song_sort);
    showSongbook();
    console.log(song_sort);
}

function changeLangChords() {
    var radio = document.getElementsByName("langChords");
    for (var i=0;i<radio.length;i++)
        if (radio[i].checked) {
            songbook.lang = radio[i].value;
            break;
        }
    console.log(songbook.lang);
}

function changeFontStyle() {
    var elt = document.getElementById("font-style");
    if (elt.selectedIndex == -1)
        return null;
    var new_font = elt.options[elt.selectedIndex].value;
    songbook.font = new_font;
}

function showSongbook() {
    var html = "<table><tbody>";
    for (var i=0;i<songbook.songs.length;i++) {
        var artist = stringSafeFromSpecialCharacters(songbook.songs[i].artist);
        var title = stringSafeFromSpecialCharacters(songbook.songs[i].title);
        html +=  "<tr>" +
                    "<th scope='row'>"+eval(i+1)+"</th>" +
                    "<td class='song-title' id='song-title-"+title+"' onclick='openSongInfoEdit(\""+artist+"\", \""+title+"\");'>"+songbook.songs[i].title +"</td>"+
                    "<td class='song-artist' id='song-artist-"+artist+"'>"+songbook.songs[i].artist +"</td>"+
                    "<td>"+
                        "<button class='btn btn-danger btn-sm rounded-1' onclick='removeSong(\""+artist+"\", \""+title+"\");' type='button' data-toggle='tooltip'"+
                        "data-placement='top' title='Delete'><i class='fa fa-trash'></i></button>"+
                    "</td>"+
                    "<td>"+
                        "<button class='btn btn-success btn-sm rounded-1' onclick='downloadSongAsPdf(\""+artist+"\", \""+title+"\");' type='button' data-toggle='tooltip'"+
                        "data-placement='top' title='Download'><i class='fas fa-download'></i><div class='btn-download'>.pdf</div></button>"+
                    "</td>"+
                    "<td>"+
                        "<button class='btn btn-warning btn-sm rounded-1' onclick='downloadSong(\""+artist+"\", \""+title+"\");' type='button' data-toggle='tooltip'"+
                        "data-placement='top' title='Download'><i class='fas fa-download'></i><div class='btn-download'>.song</div></button>"+
                    "</td>"+
                "</tr>";
    }
    html += "</table></tbody>";
    document.getElementById("songbook-container").innerHTML = html;
}

function storeSongbook() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        ajaxCallback(xhr, function (log) {
            alert(log);
        });
    };
    xhr.open("post", "/store_songbook", true);
    xhr.setRequestHeader("Content-type", "application/json");
    //var songbook_json = JSON.stringify(songbook);
    console.log(songbook.font);
    var json = JSON.stringify({ "songbook": songbook });
    xhr.send(json);
}

function addSong(song_json) {
    var song_json = JSON.parse(song_json);
    var song = new Song(song_json.url, song_json.artist, song_json.title, song_json.rating, song_json.tab);
    songbook.addSong(song);
    songbook.songs.sort(song_sort);
    showSongbook();
}

function removeSong(artist, title) {
    var song_artist_id = "song-artist-"+artist;
    var song_title_id = "song-title-"+title;
    var real_artist_name = document.getElementById(song_artist_id).innerHTML;
    var real_title_name = document.getElementById(song_title_id).innerHTML;
    songbook.removeSong(real_artist_name.replace("&amp;", "&"), real_title_name.replace("&amp;", "&"));
    showSongbook();
}

function changeTitle() {
    var new_title = document.getElementById("title-textarea").value;
    var old_title = songbook.title;
    if(!new_title || new_title == old_title) {
        alert("Il titolo inserito non è valido!");
        document.getElementById("songbook-title").innerHTML = old_title;
        //document.getElementById("songbook-title").onclick = openTextArea;
    }
    else {
        var xhr = new XMLHttpRequest();
        songbook.title = new_title;
        xhr.onreadystatechange = function () {
            ajaxCallback(xhr, function(log) {
                showSongbook();
                document.getElementById("songbook-title").innerHTML = new_title;
                //document.getElementById("songbook-title").onclick = openTextArea; 
                alert(log);
            });
        };
        console.log(new_title);
        xhr.open("get", "/change_title?old_title=" + old_title + "&new_title=" + new_title, true);
        xhr.send();
    }
}

function openSongbookInfo() {
    var artist_song_modified = document.getElementById("song-artist-fixed").innerHTML;
    var title_song_modified = document.getElementById("song-title-fixed").innerHTML;
    var url = document.getElementById("song-url-textarea").value;
    var artist = document.getElementById("song-artist-textarea").value;
    var title = document.getElementById("song-title-textarea").value;
    var rating = document.getElementById("song-rating-textarea").value;
    var tab = document.getElementById("song-tab-edit").innerHTML;
    tab = tab.split("\"").join("\'");
    var song_json = {
        "url": url,
        "artist": artist,
        "title": title,
        "rating": rating,
        "tab": tab
    }
    songbook.removeSong(artist_song_modified.replace("&amp;", "&"), title_song_modified.replace("&amp;", "&")); //remove old song
    addSong(JSON.stringify(song_json)); //add modified song
    document.getElementById("songbook-info").hidden = false;
    document.getElementById("songbook-preferences").hidden = false;
    document.getElementById("song-info").hidden = true;
}

function openSongInfoEdit(artist, title) {
    var song = "";
    for (var i=0;i<songbook.songs.length;i++) {
        song = songbook.songs[i];
        if(stringSafeFromSpecialCharacters(song.artist) == artist && 
           stringSafeFromSpecialCharacters(song.title) == title) {
            break;
        }
    }
    document.getElementById("songbook-info").hidden = true;
    document.getElementById("songbook-preferences").hidden = true;
    document.getElementById("song-info").hidden = false;
    var html = "";
    html += "<div class='header-edit'><h1 class='title-edit'>Modifica la canzone</h1>";
    html += "<button class='btn btn-primary rounded-1' id='save-btn-edit' onclick='openSongbookInfo();' type='button' data-toggle='tooltip'"+
    "data-placement='top' title='Save'>Salva</button></div>";
    html += "<div class='body-edit'><textarea class='form-control' rows='1' id='song-url-textarea' name='text'>"+song.url+"</textarea>";
    html += "<textarea class='form-control' rows='1' id='song-artist-textarea' name='text'>"+song.artist+"</textarea>";
    html += "<div id='song-artist-fixed' style='display: none;'>"+song.artist+"</div>";
    html += "<textarea class='form-control' rows='1' id='song-title-textarea' name='text'>"+song.title+"</textarea>";
    html += "<div id='song-title-fixed' style='display: none;'>"+song.title+"</div>";
    html += "<textarea class='form-control' rows='1' id='song-rating-textarea' name='text'>"+song.rating+"</textarea>";
    html += "<div contenteditable='true' id='song-tab-edit'>"+song.tab+"</div></div>";
    document.getElementById("song-info").innerHTML = html;
}

function openTextArea(e) {
    e.preventDefault();
    var title = document.getElementById('songbook-title').innerHTML;
    var html = "<table><tbody>";
    html += "<td><textarea class='form-control' rows='1' id='title-textarea' name='text'>"+title+"</textarea></td>";
    html += "<td><button class='btn btn-primary rounded-1' id='change-title' onclick='changeTitle();' type='button' data-toggle='tooltip'"+
    "data-placement='top' title='Change'>Modifica</button></td>";
    html += "</table></tbody>";
    document.getElementById("songbook-title").removeAttribute("onclick");
    document.getElementById("songbook-title").innerHTML = html;
    return;
}

function listOptions(list_json) {
    var list = JSON.parse(list_json);
    var options = "";
    list.forEach(song => {
        options += "<div class='list-group'>"+
                        "<a onclick='getSong(\""+song.url+"\")' class='list-group-item list-group-item-action'>"+song.artist+", "+song.title+", rating: "+song.rating+"</a>"+
                    "</div>";
    });
    document.getElementById('options-container').innerHTML = options;
}

function getOptions() {
    var query = document.getElementById("songs-textarea").value;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        ajaxCallback(xhr, listOptions);
    };
    xhr.open("get", "/options?query=" + query, true);
    xhr.send();
}

function checkEnterAndCallGetOptions(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        getOptions();
    }
}

function getSong(link) {
    document.getElementById('options-container').innerHTML = "";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        ajaxCallback(xhr, addSong);
    };
    xhr.open("get", "/song?link=" + link, true);
    xhr.send();
}

function getSongFromLocalDisk() {
    var file = document.getElementById("file-to-load").files[0]
    var reader = new FileReader();
    reader.onload = function(load_event) {
        var song_json = load_event.target.result;
        addSong(song_json);
    };
    var blob = new Blob([file], {type : 'text/plain'});
    reader.readAsText(blob, "UTF-8");
}

function downloadSong(artist, title) {
    var songbook_to_save_as_url = "";
    var song = "";
    var real_artist_name = document.getElementById("song-artist-"+artist).innerHTML.replace("&amp;", "&");
    var real_title_name = document.getElementById("song-title-"+title).innerHTML.replace("&amp;", "&");
    for (var i=0;i<songbook.songs.length;i++) {
        song = songbook.songs[i];
        if(song.artist == real_artist_name && song.title == real_title_name) {
            var blob = new Blob([JSON.stringify(song)], {type : 'application/json'});
            songbook_to_save_as_url = window.URL.createObjectURL(blob);
            break;
        }
    }
 
    var downloadLink = document.createElement("a");
    downloadLink.download = song.title + ".song";
    downloadLink.innerHTML = "Download File";
    downloadLink.href = songbook_to_save_as_url;
    //downloadLink.onclick = document.body.removeChild(event.target);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
}

function songToHTML(song) {
    var html = ""
    for(var attr in song) {
        html += "<div class='"+attr+"'>"+song[attr]+"</div>";
        if(attr == "artist")
            html += "<hr style='width:95%;text-align:left;margin-left:0;margin-top:1.8rem;'>";
    }
    console.log(html);
    return html;
}

function formatChordsInItalian(tab) {
    console.log(tab);
    var italian_tab = "";
    var prev_index = 0, index = 0;
    while((index = tab.indexOf("<span class='ch'>", prev_index)) != -1) {
        var part_of_tab = tab.substring(prev_index, index) + "<span class='ch'>";
        console.log(part_of_tab);
        italian_tab += part_of_tab;
        prev_index = tab.indexOf("</span>", index);
        var chord = tab.substring(index + "<span class='ch'>".length, prev_index);
        chord = chord.replace(/A|B|C|D|E|F|G/gi, function (x) {
            switch(x) {
                case "A": x = "LA"; break;
                case "B": x = "SI"; break;
                case "C": x = "DO"; break;
                case "D": x = "RE"; break;
                case "E": x = "MI"; break;
                case "F": x = "FA"; break;
                case "G": x = "SOL"; break;
            }
            return x;
          });
        italian_tab += chord + "</span>";
        prev_index += "</span>".length;
    }
    if(italian_tab == "")
        italian_tab = tab;
    return italian_tab;
}

function getFontSongbook() {
    var elt = document.getElementById("font-style");
    if (elt.selectedIndex == -1)
        return null;
    return elt.options[elt.selectedIndex].text;
}

var style = ""+
".song { line-height: 1.4em; font-size: 15px; } .title { font-size: 3em; line-height: 2em; font-family: Open Sans, -apple-system, Roboto, Helvetica neue, Helvetica, sans-serif; } .artist { font-size: 1.5em; font-family: Open Sans, -apple-system, Roboto, Helvetica neue, Helvetica, sans-serif; } .url, .rating { display: none; } .ch { border-radius: 3px; padding: 2px; /*background-color: rgba(219, 219, 219, 0.74);*/ font-weight: bold; } /* body { display: table; } .song { display: table-footer-group; } .song:after { counter-increment: page; content: counter(page); } */ @media print { .pagebreak { page-break-before: always; } } @page { size: A4; margin-top: 1.9cm; margin-left: 1.9cm; margin-right: 1.32cm; margin-bottom: 3.67cm; }";

function downloadSongAsPdf(artist, title) {
    var song = "";
    var real_artist_name = document.getElementById("song-artist-"+artist).innerHTML.replace("&amp;", "&");
    var real_title_name = document.getElementById("song-title-"+title).innerHTML.replace("&amp;", "&");
    for (var i=0;i<songbook.songs.length;i++) {
        song = songbook.songs[i];
        if(song.artist == real_artist_name && song.title == real_title_name) {
            break;
        }
    }
    var html = "<!doctype html><head><link rel='stylesheet' href='../../css/songbook.css'>" +
                    "<link href='https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400&display=swap' rel='stylesheet'>" +
                    "<style>.song { font-family: " + getFontSongbook() + "; }" + style + "</style>" + 
                "</head><body>";
    var html_song = "";
    var song_tmp = new Song(song.url, song.artist, song.title, song.rating, song.tab);
    if(songbook.lang == "Italian") {
        var tab = formatChordsInItalian(song_tmp.tab);
        song_tmp.tab = tab;
        html_song = songToHTML(song_tmp);
    } 
    else {
        html_song = songToHTML(song_tmp);
    }
    html += "<div class='song'>" + html_song + "</di><div class='pagebreak'/>";
    html += "</body>";
    var myWindow = window.open("");
    myWindow.document.write(html);

    // Safari check... error @page
    checkBrowser();
}

function downloadSongbookAsPdf() {
    var html = "<!doctype html><head><link rel='stylesheet' href='../../css/songbook.css'>" +
                    "<link href='https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400&display=swap' rel='stylesheet'>" +
                    "<style>.song { font-family: " + getFontSongbook() + "; }" + style + "</style>" + 
                "</head><body>";

    // TITLE
    var title_parts = songbook.title.split(" ");
    html += "<div class='first-page'>";
    for(var i=0;i<title_parts.length;i++) {
        var custom_style = "";
        if(i+1 == title_parts.length)
            custom_style = "style='clear: both;'";
        html += "<div class='first-page-title' id='title-word-" + i + "' " + custom_style + ">" + title_parts[i] + "</div>";
    }
    html += "</div><div class='pagebreak'/>";

    // BODY
    for(var i=0;i<songbook.songs.length;i++) {
        var html_song = "";
        var song = songbook.songs[i];
        var song_tmp = new Song(song.url, song.artist, song.title, song.rating, song.tab);
        if(songbook.lang == "Italian") {
            var tab = formatChordsInItalian(song_tmp.tab);
            song_tmp.tab = tab;
            html_song = songToHTML(song_tmp);
        } 
        else {
            html_song = songToHTML(song_tmp);
        }
        html += "<div class='song'>" + html_song + "</div><div class='pagebreak'/>";
    }
    html += "</body>";
    //console.log(html);
    var myWindow = window.open("");
    myWindow.document.write(html);

    // Safari check... error @page 
    checkBrowser();
}