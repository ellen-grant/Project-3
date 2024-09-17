// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Initialize all the LayerGroups that we'll use.
let layers = {
    TOPIC: new L.LayerGroup(),
    AGE_GROUP: new L.LayerGroup(),
    GENDER: new L.LayerGroup(),
    RACE_AND_ETHNICITY: new L.LayerGroup()
  };
 
  // Create the map with our layers.
let map = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 5,
    layers: [
      layers.TOPIC,
      layers.AGE_GROUP,
      layers.GENDER,
      layers.RACE_AND_ETHNICITY
    ]
  });
 
  // Add our "streetmap" tile layer to the map.
streetmap.addTo(map);

// Create an overlays object to add to the layer control.
let overlays = {
    "Topic": layers.TOPIC,
    "Age Group": layers.AGE_GROUP,
    "Gender": layers.GENDER,
    "Race and Ethnicity": layers.RACE_AND_ETHNICITY
  };
 
  // Create a control for our layers, and add our overlays to it.
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map.
let info = L.control({
    position: "bottomright"
  });
 
  // When the layer control is added, insert a div with the class of "legend".
info.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    return div;
  };

  // Add the info legend to the map.
  info.addTo(map);

  // Create a marker cluster group
var markers = L.markerClusterGroup();

// Function to parse the CSV and add markers to the map
function addMarkersFromCSV(csvData) {
    csvData.forEach(function(row) {
        // Extract the latitude and longitude from the 'Geolocation' field
        var geolocation = row['Geolocation'];
        if (geolocation) {
            var matches = geolocation.match(/POINT \(([^ ]+) ([^ ]+)\)/);
            if (matches) {
                var lon = parseFloat(matches[1]);
                var lat = parseFloat(matches[2]);

                // Add the marker to the cluster group
                var marker = L.marker(new L.LatLng(lat, lon));
                markers.addLayer(marker);
            }
        }
    });

// Add marker cluster group to the map
map.addLayer(markers);
}

// Load CSV file using PapaParse
Papa.parse("Resources/cleaned_data.csv", {
    download: true,
    header: true,
    complete: function(results) {
        // Once CSV is loaded, add markers
        addMarkersFromCSV(results.data);
    }
});