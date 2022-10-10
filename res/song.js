function get_soundcloud_rec(url) {
    return fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json&maxheight=166`)
        .then(x => x.json())
        .then((resp) => {
            let element = document.createElement("div");
            element.innerHTML = resp.html;
            return element;
        });
}
async function load() {
    let conf = await fetch("conf.json").then(x => x.json());
    let song_file = `songs/${document.location.hash.substring(1)}.json`;
    let song = await fetch(song_file).then(x => x.json());
    document.getElementsByTagName("title")[0].innerText = `${conf.site_name} - ${song.title}`;
    document.getElementsByTagName("h1")[0].innerText = song.title;
    let lyrics = document.getElementById("lyrics");
    song.lyrics.forEach((stanza, i) => {
        let s = document.createElement("p");
        s.innerHTML = stanza.join("<br>");
        if (song.refrain[i]) {
            s.classList.add("refrain");
        }
        lyrics.appendChild(s);
    });
    let tag_list = document.getElementById("tags");
    for (const tag of song.tags) {
        let tag_element = create_tag(conf, tag);
        tag_list.appendChild(tag_element);
    }
    if (song.recordings.length > 0) {
        let recs = document.getElementById("recordings");
        recs.classList.remove("d-none");
        for (const rec of song.recordings) {
            switch (rec.type) {
                case "soundcloud":
                    get_soundcloud_rec(rec.url).then((x) => recs.appendChild(x));
                    break;
            }
        }
    }
}
