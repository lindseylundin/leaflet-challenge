// Create tile layer for the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// Create map
var myMap = L.map("map", {
    center: [50, -120],
    zoom: 3.5,
  });

// Add light tile layer to map
lightmap.addTo(myMap);

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Store API endpoint inside queryUrl
d3.json(queryURL).then((data) => {
// Grab list of earthquakes
    var quakes = data.features;

    quakes.forEach(earthquake => {
       var place = earthquake.properties.place;
       var lat = earthquake.geometry.coordinates[1];
       var lng = earthquake.geometry.coordinates[0];
       var mag = earthquake.properties.mag;
       var depth = earthquake.geometry.coordinates[2];

       var marker = L.circleMarker([lat, lng], {
            radius: mag * 5,
            opacity: 1,
            fillOpacity: .9,
            color: "black",
            stroke: true,
            weight: .5,
            fillColor: colormydot(depth)
        }).addTo(myMap);


        // Popup text for markers
        marker.bindPopup(`<h3>Location: ${place}</h3><hr>
        <h3>Time: ${new Date(earthquake.properties.time)}</h3><hr>
        <h3>Magnitude: ${mag}</h3><hr>
        <h3>Depth: ${depth} km</h3>`)
});


   // legend for map
   var legend = L.control({
    position: "bottomright"
  });
    // Layer control 
    legend.onAdd = function() {

    // Create div for legend
    var div = L.DomUtil.create("div", "legend");
    // Colors to categorize earthquake depths
    var depths = ["-10-10","10-30","30-50","50-70","70-90","90+"];
    depthCategory = [colormydot(0),colormydot(10),colormydot(30),colormydot(50),colormydot(70),colormydot(90)];
    var markers = [];

    // Adding depth colors and text to Legend
    var legendInfo = "<ul>";

    // Loop through depthCategory
    for (i=0;i<depthCategory.length;i++) {
      // Append li with correct background color and depth description
      markers.push(`<div class="rectangle" style="background-color:${depthCategory[i]}"><div class="text">
                   <li>${depths[i]}</li></div></div>`);
    }

    // Add legendInfo to HTML for div
    div.innerHTML = legendInfo + markers.join("") + "</ul>";

    return div;
  };

    // Add legend to map
    legend.addTo(myMap);

});


// Function to assign color based on depth
function colormydot(depthNum) {

    // Declare color variable
    var color;
  
    // If depth is greater than or equal to 90
    if (depthNum >= 90) {
      color = "#FF4019";
    }
  
    // If depth is greater than or equal to 70
    else if (depthNum >= 70) {
      color = "#FF8C19";
    }
    
    // If depth is greater than or equal to 50
    else if (depthNum >= 50) {
      color = "#FFB319";
    }
    
    // If depth is greater than or equal to 30
    else if (depthNum >= 30) {
      color = "#FFD919";
    }
  
    // If depth is greater than or equal to 10
    else if (depthNum >= 10) {
      color = "#B3FF19";
    }
  
    // If depth is less than 10
    else {
      color = "#66FF19";
    }
  
    // Return correct color
    return color;
  }
