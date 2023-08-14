document.addEventListener("DOMContentLoaded", function(event) {
    fetchData().then(data => {
        createChart(data);
    });
});
