document.addEventListener('DOMContentLoaded', () => {
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

// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// Create an overlays object to add to the layer control.
let overlays = {
  "Topic": layers.TOPIC,
  "Age Group": layers.AGE_GROUP,
  "Gender": layers.GENDER,
  "Race and Ethnicity": layers.RACE_AND_ETHNICITY
};

// Create a control for our layers, and add our overlays to it.
L.control.layers(null, overlays).addTo(map);

// Store the API query variables.
let baseURL = "https://data.cdc.gov/api/views/hfr9-rurv/rows.json?accessType=DOWNLOAD";
// Add the dates in the ISO formats
let date = "&$where=created_date between '2015-01-01T00:00:00' and '2022-01-01T00:00:00'";
// Add the complaint type.
let complaint = "&complaint_type=Cognitive_Decline";

// Assemble the API query URL.
let url = baseURL + date + complaint;

// Get the data with d3.
d3.json(url).then(function(response) {
  let markers = L.markerClusterGroup();
  console.log("Response Data:",response); 

  // Loop through the data.
  for (let i = 0; i < response.length; i++) {
    // Set the data location property to a variable.
    let location = response[i].Geolocation;  // Make sure Geolocation field exists and contains data

  if (location) {
    markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
      .bindPopup(response[i].descriptor));
    }
  }

  // Add our marker cluster layer to the map.
  map.addLayer(markers);  
}).catch(error => console.error('Error fetching data:', error));  
});

// // Initialize all the LayerGroups that we'll use.
// let layers = {
//   TOPIC: new L.LayerGroup(),
//   AGE_GROUP: new L.LayerGroup(),
//   GENDER: new L.LayerGroup(),
//   RACE_AND_ETHNICITY: new L.LayerGroup()
// };


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



