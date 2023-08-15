document.addEventListener("DOMContentLoaded", function(event) {
    
    function fetchDataForSelectedFile() {
        const selectedFile = document.getElementById("json-selector").value;
    
        // Remove the old SVG if it exists
        d3.select("svg").remove();
    
        fetchData(selectedFile).then(data => {
            console.log(data);
            createChart(data);
        });
    }
    

    // Event listener for the JSON file dropdown selection
    document.getElementById("json-selector").addEventListener("change", fetchDataForSelectedFile);

    // Initial load of default data
    fetchDataForSelectedFile();

});
