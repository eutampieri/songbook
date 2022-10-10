async function load() {
    let conf = await fetch("conf.json").then(x => x.json());
    create_navbar(conf, document.getElementsByTagName("nav")[0]);
    let index = await fetch("index.json").then(x => x.json());
    document.getElementsByTagName("title")[0].innerText = conf.site_name;
    document.getElementsByTagName("h1")[0].innerText = conf.site_name;
    let table = document.getElementById("tb");
    for (const song of index) {
        let row = document.createElement("tr");
        row.innerHTML = `<th scope="row"><a href="song.html?${song.id}">${song.title}</a></th>
                    <td>${song.authors.join(', ')}</td>
                    <td class="tags"></td>`;
        let tag_cell = row.getElementsByClassName("tags")[0];
        for (const tag of song.tags) {
            tag_cell.appendChild(create_tag(conf, tag));
        }
        table.appendChild(row);
    }
}
