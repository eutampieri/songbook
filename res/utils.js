function hashName(name) {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        sum += name[i].charCodeAt();
    }
    sum = sum % 6;
    return ["primary", "secondary", "success", "danger", "warning", "info"][sum]
}
