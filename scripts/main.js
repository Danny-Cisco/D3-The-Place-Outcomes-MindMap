document.addEventListener("DOMContentLoaded", function(event) {
    
    // Fetch data based on selected JSON file
    function fetchDataForSelectedFile() {
        const selectedFile = document.getElementById("json-selector").value;
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
