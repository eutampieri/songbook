/*

function getTab(params, delay) {
    return new Promise((resolve, reject) => {
        //setting timeout to help deal with response
        setTimeout(() => {
            //search on www.ultimateguitar.com
            ugs.search(params, function (link_best_tab) {
                if (link_best_tab == "") {
                    //search on www.accordiespartiti.it
                    //console.log("ricerca!"); 
                    aes.search(params, function(link_best_tab) {
                        if(link_best_tab == "") {
                            return resolve("null"+params);
                        }
                        aes.getTab(link_best_tab, function(tab_html) {
                            return resolve(tab_html);
                        });
                    })
                    
                    ugs.search(params[1], function (link_best_tab) {
                        if (link_best_tab == "") {
                            return resolve("null" + params);
                        }
                        else {
                            ugs.getTab(link_best_tab, function (tab_html) {
                                return resolve(tab_html);
                            });
                        }
                    });
                    return resolve("null" + params);
                }
                else {
                    ugs.getTab(link_best_tab, function (tab_html) {
                        return resolve(tab_html);
                    });
                }
            });
        }, 500 * delay);
    });
}

function checkSongs(songs, callback) {
    promises = [];
    songs = JSON.parse(songs);
    for (var i = 0; i < songs.length; i++) {
        var song_and_author = songs[i].split('-');
        var song = song_and_author[0].trim();
        var author = song_and_author[1].trim();
        var params = [author, song];
        promises.push(getTab(params, i));
    }
    Promise.all(promises)
        .then((results) => {
            var songbook = "";
            var fails = [];
            //console.log(results);
            for (var i = 0; i < results.length; i++) {
                fs.writeFile("./log.txt", results[i], function (err) {
                    if (err)
                      return console.log(err);
                    //console.log("The tab was saved!");
                });
                if (results[i].substring(0, 4) == 'null') {
                    var fail = results[i].substring(4);
                    fails.push(fail);
                }
                else
                    songbook += results[i] + "<div class='pagebreak'></div>";
            }
            return callback(songbook, fails);
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports.checkSongs = checkSongs;
*/

// NEW PROGRAM

var env = require('../utility_environment.js');
//var aes = require('./accordi_spartiti_utility.js');
var fs = require('fs');
var ugs = require('./ultimate_guitar_utility.js');
var Songbook = require('../public/scripts/classes/songbook');
var songbooks_folder = env.getSongbooksFolder();

function getText(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf-8", (err, data) => {
            if (err) {
                //reject (err);
                data = "";
            }
            resolve(data);
        });
    });
}

function getSongbook(title, callback) {
    console.log("MODEL\nè arrivato il titolo: "+title);
    if(title == "")
        title = "Nuovo Canzoniere";
    path = songbooks_folder + title + '.songbook';
    console.log("path: "+path);
    fs.readFile(path, (err, data) => {
        var songbook;
        if (err)
            songbook = new Songbook(title);
        else
            songbook = JSON.parse(data);
        var json = JSON.stringify(songbook);
        //console.log(json);
        callback(json);
    });
}

function getSongbooks(callback) {
    fs.readdir(songbooks_folder, (err, files) => {
        var songbooks = [];
        for (var i=0;i<files.length;i++) {
            if (files[i].includes('.songbook'))
                songbooks.push(files[i].substring(0, files[i].length - 9));
        }
        console.log(songbooks);
        callback(songbooks);
    });
}

function storeSongbook(json, callback) {
    var songbook = JSON.parse(json);
    //console.log("ECCO IL FILE JSON RICEVUTO DAL MODEL\n"+json);
    fileName = songbooks_folder + songbook.title + ".songbook";
    fs.writeFile(fileName, json, function (err) {
        if (err)
            return console.log(err);
        console.log(fileName + " saved!");
        callback(fileName + " saved!");
    });
}

function changeTitle(old_title, new_title, callback) {
    getSongbook(old_title, function (songbook) {
        songbook = JSON.parse(songbook);
        songbook.title = new_title;
        console.log("new title for "+old_title+": "+new_title);
        songbook = JSON.stringify(songbook);
        storeSongbook(songbook, function (log) {
            fs.unlink(songbooks_folder + old_title + ".songbook", callback);
        })
    });
}

function getSongOptions(to_search, callback) {
    ugs.searchSong(to_search, function (songOptions) {
        console.log("Il model sta restituendo al controller le opzioni senza Tab");
        return callback(songOptions);
    });
}

function getSongTab(link_tab, callback) {
    ugs.getSong(link_tab, function (song) {
        console.log("Il model sta restituendo al controller la canzone con Tab: "+song.url+", "+song.artist+", "+song.title);
        return callback(song);
    });
}

module.exports.getText = getText;
module.exports.getSongbook = getSongbook;
module.exports.getSongbooks = getSongbooks;
module.exports.storeSongbook = storeSongbook;
module.exports.changeTitle = changeTitle;
module.exports.getSongOptions = getSongOptions;
module.exports.getSongTab = getSongTab;