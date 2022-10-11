var dict = "";
var lang_of_dict = "";

function lang() {
    return document.getElementById('lang').innerHTML;
}

function checkBrowser() {
    // Safari check... error @page
    if(navigator.appVersion.includes("Safari") && !navigator.appVersion.includes("Chrome"))
    alert('La stampa su Safari non funziona correttamente...\nSe vuoi la massima qualità cambia Browser!');
}

function stringSafeFromSpecialCharacters(string) {
    string = string.split("\'").join("")
                   .split("\"").join("")
                   .split(" ").join("");
    return string;
}

function ajaxCallback(xhr, callback) {
    //check state
    if (xhr.readyState === 2) {
        // theElement.innerHTML = "send request...";
    }
    else if (xhr.readyState === 3) {
        // theElement.innerHTML = "receiving response...";
    }
    else if (xhr.readyState === 4) {
        //check server response
        if (xhr.status === 200) {
            //success
            if (xhr.responseText) {
                callback(xhr.responseText);
            }
        }
    }
}