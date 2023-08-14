document.addEventListener("DOMContentLoaded", function(event) {
    fetchData().then(data => {
        console.log(data);
        createChart(data);
    });
});
