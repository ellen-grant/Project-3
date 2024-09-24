document.addEventListener('DOMContentLoaded', () => {
  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a marker cluster group
  let markers = L.markerClusterGroup();

  // Create the map object with options.
  let map = L.map("map", {
    center: [37.0902, -95.7129],  // Center of the US
    zoom: 4,
    layers: [streetmap, markers]
  });

  // Add layer control to the map
  L.control.layers({ "Street Map": streetmap }, { "Cognitive Decline Markers": markers }, { collapsed: false }).addTo(map);

  // Fetch the data from the CDC API using d3.json
  d3.json("https://data.cdc.gov/api/views/hfr9-rurv/rows.json").then(function(data) {
    console.log("Loaded API Data:", data); // Check the data structure

    // Loop through the data and extract relevant information
    data.data.forEach(row => {
      // Extract the coordinates from the 'Geolocation' field in the response data
      let geolocation = row[12]; 
      
      if (geolocation) {
        // Extract latitude and longitude from 'POINT (longitude latitude)'
        let matches = geolocation.match(/POINT \(([^ ]+) ([^ ]+)\)/);
        
        if (matches) {
          let lon = parseFloat(matches[1]);
          let lat = parseFloat(matches[2]);

          // Check if coordinates are valid
          if (!isNaN(lat) && !isNaN(lon)) {
            // Create a marker and add it to the marker cluster group
            let marker = L.marker([lat, lon])
              .bindPopup(`<strong>State:</strong> ${row[8]}<br>  <!-- Adjust based on your data structure -->
                          <strong>Topic:</strong> ${row[9]}<br> <!-- Adjust based on your data structure -->
                          <strong>Age Group:</strong> ${row[11]}<br>
                          <strong>Gender:</strong> ${row[12]}<br>
                          <strong>Race and Ethnicity:</strong> ${row[13]}<br>
                          <strong>Data Value (%):</strong> ${row[14]}`);

            markers.addLayer(marker);
          }
        }
      }
    });

    // Add our marker cluster layer to the map
    map.addLayer(markers);
  }).catch(error => console.error('Error loading API data:', error));
});

// document.addEventListener('DOMContentLoaded', () => {
// // Initialize all the LayerGroups that we'll use.
// let layers = {
//   TOPIC: new L.LayerGroup(),
//   AGE_GROUP: new L.LayerGroup(),
//   GENDER: new L.LayerGroup(),
//   RACE_AND_ETHNICITY: new L.LayerGroup()
// };

//   // Create the map with our layers.
// let map = L.map("map", {
//   center: [37.0902, -95.7129],
//   zoom: 4,
//   layers: [
//     layers.TOPIC,
//     layers.AGE_GROUP,
//     layers.GENDER,
//     layers.RACE_AND_ETHNICITY
//   ]
// });

// // Create the tile layer that will be the background of our map.
// let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);


// // Create an overlays object to add to the layer control.
// let overlays = {
//   "Topic": layers.TOPIC,
//   "Age Group": layers.AGE_GROUP,
//   "Gender": layers.GENDER,
//   "Race and Ethnicity": layers.RACE_AND_ETHNICITY
// };

// // Create a control for our layers, and add our overlays to it.
// L.control.layers(null, overlays).addTo(map);


// // Create a legend to display information about our map.
// let info = L.control({
//   position: "bottomright"
// });

// // When the layer control is added, insert a div with the class of "legend".
// info.onAdd = function() {
//   let div = L.DomUtil.create("div", "legend");
//   div.innerHTML = "<h4>Cognitive Decline in the US</h4>";
//   return div;
// };

// // Add the info legend to the map.
// info.addTo(map);

// // Initialize an object that contains icons for each layer group.
// let icons = {
//   TOPIC: L.ExtraMarkers.icon({
//     markerColor: "yellow",
//     shape: "star"
//   }),
//   AGE_GROUP: L.ExtraMarkers.icon({
//     markerColor: "green",
//     shape: "circle"
//   }),
//   RACE_AND_ETHNICITY: L.ExtraMarkers.icon({
//     markerColor: "blue-dark",
//     shape: "circle"
//   }),
//   GENDER: L.ExtraMarkers.icon({
//     markerColor: "orange",
//     shape: "circle"
//   }),
//   Geolocation: L.ExtraMarkers.icon({
//     markerColor: "red",
//     shape: "circle"
//   })
// };
// // Perform an API call to the endpoint.
// d3.json("https://data.cdc.gov/api/views/hfr9-rurv/rows.json").then(function(infoRes) {

//   // When the first API call completes, perform another call to the endpoint.
//   d3.json("https://data.cdc.gov/api/views/hfr9-rurv/rows.json").then(function(statusRes) {
//     let updatedAt = infoRes.last_updated;
//     let stationStatus = statusRes.data.stations;
//     let stationInfo = infoRes.data.stations;

// // Store the API query variables.
// let baseURL = "https://data.cdc.gov/api/views/hfr9-rurv/rows.json?accessType=DOWNLOAD";
// // Add the dates in the ISO formats
// let date = "&$where=created_date between '2015-01-01T00:00:00' and '2022-01-01T00:00:00'";
// // Add the complaint type.
// let complaint = "&complaint_type=Cognitive_Decline";

// // Assemble the API query URL.
// let url = baseURL + date + complaint;

// // Get the data with d3.
// d3.json(url).then(function(response) {
//   let markers = L.markerClusterGroup();
//   console.log("Response Data:",response); 

//   // Loop through the data.
  // for (let i = 0; i < response.length; i++) {
  //   // Set the data location property to a variable.
  //   let location = response[i].Geolocation;  // Make sure Geolocation field exists and contains data

//   if (location) {
//     markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
//       .bindPopup(response[i].descriptor));
//     }
//   }

//   // Add our marker cluster layer to the map.
//   map.addLayer(markers);  
// }).catch(error => console.error('Error fetching data:', error));  
// });
