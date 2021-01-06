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
                data = "";
            }
            resolve(data);
        });
    });
}

function getSongbook(title, callback) {
    if (title == "")
        title = "Nuovo Canzoniere";
    path = songbooks_folder + title + '.songbook';
    fs.readFile(path, (err, data) => {
        var songbook;
        if (err)
            songbook = new Songbook(title);
        else
            songbook = JSON.parse(data);
        var json = JSON.stringify(songbook);
        callback(json);
    });
}

function getSongbooks(callback) {
    fs.readdir(songbooks_folder, (err, files) => {
        var songbooks = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i].includes('.songbook'))
                songbooks.push(files[i].substring(0, files[i].length - 9));
        }
        callback(songbooks);
    });
}

function storeSongbook(json, callback) {
    var songbook = JSON.parse(json);
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
        songbook = JSON.stringify(songbook);
        storeSongbook(songbook, function (log) {
            fs.unlink(songbooks_folder + old_title + ".songbook", callback);
        })
    });
}

function getSongOptions(to_search, callback) {
    ugs.searchSong(to_search, function (songOptions) {
        return callback(songOptions);
    });
}

function getSongTab(link_tab, callback) {
    ugs.getSong(link_tab, function (song) {
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