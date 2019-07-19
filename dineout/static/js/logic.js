// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
  center: [47.1164, -101.2996],
  zoom: .5
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// var marker = L.marker([43.6532, -79.3832], {
//   draggable: true,
//   title: "My First Marker"
// }).addTo(myMap);
// // Binding a pop-up to our marker
// marker.bindPopup("Hello There!");

function markerSize(overall_score) {
  return overall_score * 40;
}

d3.json("/map", function(restaurants){
console.log(restaurants)

for (var i = 0; i < restaurants.length; i++) {
  L.circle(restaurants[i].location, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: "purple",
    // Setting our circle's radius equal to the output of our markerSize function
    // This will make our marker's size proportionate to its population
    radius: markerSize(restaurants[i].overall_score)
  }).bindPopup("<h5>" + restaurants[i].name + "</h5> <hr> <h6>Rating: " + restaurants[i].overall_score + "</h6>").addTo(myMap);
}
})

