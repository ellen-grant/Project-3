document.addEventListener('DOMContentLoaded', () => {
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
    zoom: 4,
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
    "Race and Ethnicity": layers.RACE_AND_ETHNICITY,
    "Marker Layer": markers
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
    div.innerHTML = "<h4>Cognitive Decline in the US</h4>";
    return div;
  };

  // Add the info legend to the map.
  info.addTo(map);

  // Create a marker cluster group
  let markers = L.markerClusterGroup();

  // Fetch data from the server
  fetch('http://localhost:8000/data')
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
      console.log(data);
      // Iterate through each point in the fetched data
      data.forEach(point => {
        // Add a marker for each data point
        L.marker([point.Latitude, point.Longitude])
          .bindPopup(`Lat: ${point.Latitude}, Lng: ${point.Longitude}`)
          .addTo(map);
      });

      // Add marker cluster group to the map
      map.addLayer(map);
    })
    .catch(error => console.error('Error fetching data:', error));
});

// Server-side setup (this should be in a separate server file)
let express = require('express');
let sqlite3 = require('sqlite3').verbose();
let cors = require('cors'); // Optional: to handle CORS
let app = express();
let port = 8000;

// Setup SQLite database connection
let db = new sqlite3.Database('/Users/ellengrant/Desktop/3/Project-3/starter code/ALZ.db');

// Middleware
app.use(cors()); // Optional: enable CORS if needed

// API endpoint to get data
app.get('/data', (req, res) => {
  db.all('SELECT Latitude, Longitude FROM Alz_Data_Table', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});