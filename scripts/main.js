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

    // This is your new handleResize function
    function handleResize() {
        // Recreate the chart using current window width
        fetchDataForSelectedFile();
    }

    // Event listener for the JSON file dropdown selection
    document.getElementById("json-selector").addEventListener("change", fetchDataForSelectedFile);

    // Event listener for window resizing
    window.addEventListener('resize', handleResize);

    // Initial load of default data
    fetchDataForSelectedFile();

});
