var rp = require('request-promise');
var cheerio = require('cheerio');
var fs = require('fs');
var Song = require('../public/scripts/classes/song');

function formatTab(result) {
  var html = "";
  var tab = result["tab_view"]["wiki_tab"].content;
  /*
  var capo = result["tab_view"]["meta"].capo;
  var tonality = result["tab_view"]["meta"].tonality;
  var tuning = result["tab_view"]["meta"]["tuning"].name;
  var difficulty = result["tab_view"]["meta"].difficulty;
  console.log("stampo: " + song_name + artist_name + capo + tonality + tuning + difficulty);
  */

  /*
  html += "<div class='meta'>";
  html += "<div class='capo'>Capo: " + capo + "</div>";
  html += "<div class='tonality'>Tonalità: " + tonality + "</div>";
  html += "<div class='tuning'>Tuning: " + tuning + "</div>";
  html += "<div class='difficulty'>Difficoltà: " + difficulty + "</div>";
  html += "</div>
  */
  html += "<br><br><div class='tab'>";
  tab = tab.split("\r\n").join("<br/>");
  tab = tab.split("\"").join("'");
  tab = tab.split("\t").join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
  tab = tab.split(" ").join("&nbsp;");
  tab = tab.split("[tab]").join("<span class='tab'>");
  tab = tab.split("[/tab]").join("</span>");
  tab = tab.split("[ch]").join("<span class='ch'>");
  tab = tab.split("[/ch]").join("</span>");

  /*
  fs.writeFile("./tabEditata.html", tab, function (err) {
    if (err)
      return console.log(err);
    console.log("Salvatoooooooo!");
  });
  */

  var edited_tab = tab;

  html += edited_tab;
  html += "</div>";

  return html;
}

function getSong(link, callback) {
  if (link == "")
    return callback("");
  rp(link)
    .then(function (html) {
      var $ = cheerio.load(html);
      var json_response = $('.js-store').attr('data-content');
      var json = json_response.replace("&quot;", "\"");
      var json_dom = JSON.parse(json);
      var result = json_dom["store"]["page"]["data"];
      var tab = formatTab(result);
      var song_name = result["tab"].song_name;
      var artist_name = result["tab"].artist_name;
      var rating = result["tab"].rating;
      var song = new Song(link, artist_name, song_name, rating, tab);

      callback(song);
    })
    .catch(function (err) {
      callback("");
      console.log(err);
    });
}

function formatOptions(results) {
  options = []
  results.forEach(function (r) {
    var song = new Song(r["tab_url"], r["artist_name"], r["song_name"], r["rating"], "Not loaded yet!");
    options.push(song);
    console.log(song);
  });
  return options;
}

function searchSong(query, callback) {
  console.log(query);
  rp('http://www.ultimate-guitar.com/search.php?search_type=title&value=' + query)
    .then(function (html) {
      var $ = cheerio.load(html);
      var json_response = $('.js-store').attr('data-content');
      var json = json_response.replace("&quot;", "\"");
      var json_dom = JSON.parse(json);
      var results = json_dom["store"]["page"]["data"]["results"];

      for (var i = 0; i < results.length; i++) {
        if (results[i].marketing_type == "TabPro") {
          delete results[i];
          console.log(results[i]);
        }
      }

      /*
      fs.writeFile("./search.json", json, function (err) {
        if (err)
          return console.log(err);
        console.log("The tab was saved!");
      });
      */

      var options = formatOptions(results);
      return callback(options);
    })
    .catch(function (err) {
      callback([]);
      console.log(err);
    });
};

module.exports.searchSong = searchSong;
module.exports.getSong = getSong;