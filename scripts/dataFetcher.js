async function fetchData() {
    let response = await fetch("data/outcomes_0.1.json");
    let data = await response.json();
    return data;
}
