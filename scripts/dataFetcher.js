async function fetchData(filename) {
    let response = await fetch("./data/" + filename);
    let data = await response.json();
    return data;
}
