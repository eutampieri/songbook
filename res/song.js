function get_soundcloud_rec(url) {
    return fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json&maxheight=166`)
        .then(x => x.json())
        .then((resp) => {
            let element = document.createElement("div");
            element.innerHTML = resp.html;
            return element;
        });
}
function print_chord(chord, prefix) {
    let chord_el = document.createElement("span");
    let chord_text = document.createElement("span");
    chord_text.innerText = chord
    let chord_prefix = document.createElement("span");
    chord_prefix.innerText = prefix
    chord_prefix.style.visibility = "hidden";
    chord_prefix.ariaHidden = true;
    chord_el.appendChild(chord_prefix);
    chord_el.appendChild(chord_text);
    return chord_el;
}
async function load() {
    let conf = await fetch("conf.json").then(x => x.json());
    create_navbar(conf, document.getElementsByTagName("nav")[0]);
    let song_file = `songs/${document.location.search.substring(1)}.json`;
    let song = await fetch(song_file).then(x => x.json());
    document.getElementsByTagName("title")[0].innerText = `${conf.site_name} - ${song.title}`;
    document.getElementsByTagName("h1")[0].innerText = song.title;
    let chord_map = [];
    for (const l of song.lyrics) {
        chord_map.push([]);
        for (const _ of l) {
            chord_map[chord_map.length - 1].push([]);
        }
    }
    for (const chord of song.chords) {
        chord_map[chord.stanza][chord.row].push(print_chord(chord.chord, song.lyrics[chord.stanza][chord.row].substring(0, chord.position)));
    }
    let lyrics = document.getElementById("lyrics");
    song.lyrics.forEach((stanza, i) => {
        let s = document.createElement("p");
        lyrics.appendChild(s);
        stanza.forEach((row, j) => {
            if (chord_map[i][j].length > 0) {
                let chords = document.createElement("div");
                s.appendChild(chords);
                let current_offset = 0;
                for (let c of chord_map[i][j]) {
                    c.style.marginLeft = `${current_offset * -1}px`;
                    chords.appendChild(c);
                    current_offset = c.offsetWidth;
                }
                chords.classList.add("chord");
            }
            let r = document.createElement("div");
            r.innerText = row;
            s.appendChild(r);
        });
        if (song.refrain[i]) {
            s.classList.add("refrain");
        }
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
                case "cfstream":
                    let container = document.createElement("div");
                    container.innerHTML = `<iframe src="https://iframe.videodelivery.net/${rec.id}" style="border: none; height: 100%; width: 100%;"  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowfullscreen="true"></iframe>`;
                    recs.appendChild(container);
                    break;
            }
        }
    }
}
