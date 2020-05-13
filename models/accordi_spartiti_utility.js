var rp = require('request-promise');
var cheerio = require('cheerio');
var fs = require('fs');

function formatTab(tab) {
    var html = "<div>";
    tab = String(tab);
    tab = tab.split("\r").join("<br/>");
    tab = tab.split("\n").join("<br/>");
    tab = tab.split("\t").join("&nbsp;&nbsp;&nbsp;&nbsp;");
    tab = tab.split(" ").join("&nbsp;");
    html += tab;
    html += "</div>";

    return html;
}

function getTab(link, callback) {
    console.log("getTab accordiespartiti [link]: "+link);
    if (link == "")
        return callback("");
    rp(link)
        .then(function (html) {
            var $ = cheerio.load(html);
            var result = $('.chiave');
            /*
            fs.writeFile("./tab_aes.html", result, function (err) {
                if (err)
                    return console.log(err);
                console.log("The tab was saved!");
            });
            */
            var html = formatTab(result);
            /*
            fs.writeFile("./tab_aes_formatted.html", html, function (err) {
                if (err)
                    return console.log(err);
                console.log("The tab was saved!");
            });
            */
            //var html = result;
            //console.log(html);
            callback(html);
        })
        .catch(function (err) {
            callback("");
            //console.log(err);
        });
}

function chooseBestSong(results) {
    var bestRate = 0;
    var linkBestRate = "";
    for (var i = 0; i < results.length; i++)
        if (results[i]["type"] == "Chords" && results[i]["rating"] > bestRate) {
            linkBestRate = results[i]["tab_url"];
            bestRate = results[i]["rating"];
        }
    return linkBestRate;
}

function search(params, callback) {
    var query = params[0];
    //console.log(query);
    rp('https://www.accordiespartiti.it/?s=' + query)
        .then(function (html) {
            /*
            fs.writeFile("./search_aes.html", html, function (err) {
                if (err)
                    return console.log(err);
                console.log("The tab was saved!");
            });
            */
            var $ = cheerio.load(html);
            var results = [];
            var section_class = $('.risultati').nextAll('li a').attr('href');
            var section_a = $(section_class).find('a');
            for(var i=0;i<section_a.length;i++) {
                
            }
            console.log("search accordiespartiti [results]: "+results);
            //link_best_song = chooseBestSong(results);
            link_best_song = results[0];
            return callback(link_best_song);
        })
        .catch(function (err) {
            callback("");
            console.log(err);
        });
};

module.exports.search = search;
module.exports.getTab = getTab;