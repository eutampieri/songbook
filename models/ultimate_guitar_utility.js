/*
var rp = require('request-promise');
var cheerio = require('cheerio');
var fs = require('fs');

function formatTab(result) {
  var html = "";
  var song_name = result["tab"].song_name;
  var artist_name = result["tab"].artist_name;
  var tab = result["tab_view"]["wiki_tab"].content;
  
  var capo = result["tab_view"]["meta"].capo;
  var tonality = result["tab_view"]["meta"].tonality;
  var tuning = result["tab_view"]["meta"]["tuning"].name;
  var difficulty = result["tab_view"]["meta"].difficulty;
  console.log("stampo: " + song_name + artist_name + capo + tonality + tuning + difficulty);
  

  html += "<h1 class='song_name'>" + song_name + "</h1>";
  html += "<h2 class='artist_name'>" + artist_name + "</h2>";
  
  html += "<div class='meta'>";
  html += "<div class='capo'>Capo: " + capo + "</div>";
  html += "<div class='tonality'>Tonalità: " + tonality + "</div>";
  html += "<div class='tuning'>Tuning: " + tuning + "</div>";
  html += "<div class='difficulty'>Difficoltà: " + difficulty + "</div>";
  html += "</div>
  
  html += "<br><br><div class='tab'>";
  tab = tab.split("\r\n").join("<br/>");
  tab = tab.split("\t").join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
  tab = tab.split(" ").join("&nbsp;");
  tab = tab.split("[tab]").join("<span class='tab'>");
  tab = tab.split("[/tab]").join("</span>");
  tab = tab.split("[ch]").join("<span class='ch'>");
  tab = tab.split("[/ch]").join("</span>");
  html += tab;
  html += "</div>";

  return html, artist_name, song_name;
}

function getTab(link, callback) {
  console.log(link);
  if (link == "")
    return callback("", "", "");
  rp(link)
    .then(function (html) {
      var $ = cheerio.load(html);
      var json_response = $('.js-store').attr('data-content');
      var json = json_response.replace("&quot;", "\"");
      var json_dom = JSON.parse(json);
      
      fs.writeFile("./tab.json", json_response, function (err) {
        if (err)
          return console.log(err);
        console.log("The tab was saved!");
      });
      
      var result = json_dom["store"]["page"]["data"];
      var html, artist_name, song_name = formatTab(result);
      //console.log(html);
      callback(html, artist_name, song_name);
    })
    .catch(function (err) {
      callback("", "", "");
      console.log(err);
    });
}

function chooseBestSong(results, artist_name, song_name) {
  var bestRate = 0;
  var linkBestRate = "";
  //console.log(results);
  console.log(results[0]["artist_name"] + " " + results[10]["song_name"]);
  for (var i = 0; i < results.length; i++) {
    if (results[i]["type"] == "Chords" &&
      results[i]["song_name"] == song_name &&
      results[i]["artist_name"] == artist_name &&
      results[i]["rating"] > bestRate) {
      linkBestRate = results[i]["tab_url"];
      bestRate = results[i]["rating"];
    }
  }
  return linkBestRate;
}

function search(params, callback) {
  var query = "";
  for (var i = 0; i < params.length; i++)
    query += params[i] + " ";
  console.log(query);
  rp('http://www.ultimate-guitar.com/search.php?search_type=title&value=' + query)
    .then(function (html) {
      var $ = cheerio.load(html);
      var json_response = $('.js-store').attr('data-content');
      var json = json_response.replace("&quot;", "\"");
      var json_dom = JSON.parse(json);
      var results = json_dom["store"]["page"]["data"]["results"];
      //console.log(results);
      fs.writeFile("./search.json", json, function (err) {
        if (err)
          return console.log(err);
        console.log("The tab was saved!");
      });
      link_best_song = chooseBestSong(results, params[0], params[1]);
      return callback(link_best_song);
    })
    .catch(function (err) {
      callback("");
      console.log(err);
    });
};

module.exports.search = search;
module.exports.getTab = getTab;
*/

//NEW PROGRAM

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

  // FORMAT TAB IN MULTIPLE BLOCKS

  const NUM_DOT_PER_LINE = 72;
  var tab_content = "";
  var split_tab = tab.split("<span class='tab'>");
  var edited_tab = split_tab[0];
  //console.log(split_tab.length);
  for(var i=0;i<split_tab.length;i++) {
    tab_content = split_tab[i].split("</span>")[0];

    // With this if-statement I check if class='tab' is put in a wrong way inside the tab
    // If so I save the current text and skip to the next class='tab'
    if(tab_content.indexOf("<span ") == 0 || !tab_content.includes("-")) {
      //console.log(tab_content.substring(0, 100));
      edited_tab += split_tab[i];
      continue;
    }

    //console.log(tab_content);
    // I am inside a single tab block
    var result_tab = "";
    var lines = tab_content.split("<br/>");
    for(var j=0;j<lines.length;j++) {
      //console.log(i + " --> " + lines[j]);
      result[j] = [];
      for(var k=0;k<(lines[j].length/NUM_DOT_PER_LINE)+1;k++) {
        //console.log(i + " - " + k + " --> " + lines[j]);
        //console.log(i + " - " + k + " --> " + lines[j].substring(k*NUM_DOT_PER_LINE, k*NUM_DOT_PER_LINE+NUM_DOT_PER_LINE));
        result[j][k] = lines[j].substring(k*NUM_DOT_PER_LINE, k*NUM_DOT_PER_LINE+NUM_DOT_PER_LINE);
      }
    }
    var longest_line = 0;
    for(var j=0;j<lines.length;j++) {
      if(lines[j].length > longest_line)
        longest_line = lines[j].length;
    }
    //console.log(lines);
    for(var k=0;k<(longest_line/NUM_DOT_PER_LINE)+1;k++) {
      for(var j=0;j<lines.length;j++) {
        result_tab += result[j][k] + "<br/>";
      }
    }
    result_tab = result_tab.replace("undefined", "");
    /*
    fs.writeFile("./tabEditata-"+i+".txt", result_tab, function (err) {
      if (err)
        return console.log(err);
      console.log("The tab was saved!");
    });
    */
    //console.log("i = " + i + ":\n" + result_tab + "\n\n");
    //console.log("i = " + i + ":\n" + split_tab[i].substring(split_tab[i].length - tab_content.length) + "\n\n");
    edited_tab += "<span class='tab'>" + result_tab + "</span>";
    //split_tab[i].substr(split_tab[i].length - tab_content.length)
  }
  if(edited_tab == "")
    edited_tab = tab;
  
  html += edited_tab;
  html += "</div>";

  return html;
}

function getSong(link, callback) {
  //console.log(link);
  if (link == "")
    return callback("");
  rp(link)
    .then(function (html) {
      var $ = cheerio.load(html);
      var json_response = $('.js-store').attr('data-content');
      var json = json_response.replace("&quot;", "\"");
      var json_dom = JSON.parse(json);
      /*
      fs.writeFile("./tab.json", json_response, function (err) {
        if (err)
          return console.log(err);
        console.log("The tab was saved!");
      });
      */
      var result = json_dom["store"]["page"]["data"];
      var tab = formatTab(result);
      /*
      fs.writeFile("./tab.json", tab, function (err) {
        if (err)
          return console.log(err);
        console.log("The tab was saved!");
      });
      */
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
  //var query = author + " " + title;
  console.log(query);
  rp('http://www.ultimate-guitar.com/search.php?search_type=title&value=' + query)
    .then(function (html) {
      var $ = cheerio.load(html);
      var json_response = $('.js-store').attr('data-content');
      var json = json_response.replace("&quot;", "\"");
      var json_dom = JSON.parse(json);
      var results = json_dom["store"]["page"]["data"]["results"];

      // TO-DO: marketing_type['TabPro'] DEVE ESSERE RIMOSSO!!
      for(var i=0;i<results.length;i++) {
        if(results[i].marketing_type == "TabPro") {
          delete results[i];
          console.log(results[i]);
        }
      }
      //console.log(results);
      
      fs.writeFile("./search.json", json, function (err) {
        if (err)
          return console.log(err);
        console.log("The tab was saved!");
      });
      
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