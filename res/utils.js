function hashName(name) {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        sum += name[i].charCodeAt();
    }
    sum = sum % 6;
    return ["primary", "secondary", "success", "danger", "warning", "info"][sum]
}

function create_tag(conf, tag) {
    let tag_element = document.createElement("span");
    tag_element.innerText = tag;
    let tag_colour;
    if (conf.tag_overrides[tag] !== undefined) {
        tag_colour = conf.tag_overrides[tag];
    } else {
        tag_colour = hashName(tag);
    }
    tag_element.classList.add("badge");
    tag_element.classList.add("rounded-pill");
    tag_element.classList.add("me-1");
    tag_element.classList.add(`text-bg-${tag_colour}`);
    return tag_element;
}

function create_navbar(conf, nav) {
    let list = document.createElement("ul");
    for (const link of conf.custom_links) {
        let item = document.createElement("li");
        item.classList.add("nav-item");
        item.innerHTML = `<a class="nav-link" href="${link.url}">${link.label}</a>`;
        list.appendChild(item);
    }
    nav.className = "navbar navbar-expand-lg navbar-light bg-light";
    nav.innerHTML = `<div class="container-fluid">
            <img class="navbar-brand" src="${conf.logo || "logo.png"}">
            <a class="navbar-brand" href=".">${conf.site_name}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navLinks"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navLinks">
                <ul class="navbar-nav">
                ${list.innerHTML}
                </ul>
            </div>
        </div>`;
}