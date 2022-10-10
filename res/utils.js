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
    tag_element.classList.add(`text-bg-${tag_colour}`);
    return tag_element;
}

function create_navbar(conf) {

}