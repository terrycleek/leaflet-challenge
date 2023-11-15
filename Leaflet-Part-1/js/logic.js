//  tile layer for map
console.log("Step1 Ok");

// tile layer set up with attribution for copyrights
let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    });
  
  
  // Create the Map Position over California 
  let map = L.map("map", {
    center: [
      36, -119.1
    ],
    zoom: 6
  });

//  basemap added onto tile map
basemap.addTo(map);

// Retrieve Eaarthquake JSON data Past 7 days All Earthquakes
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
    
  // Earthquake format
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 1.0
    };
  }
  // Color Depth function
  function getColor(depth) {
    switch (true) {
      case depth > 90:
        return "#ff0000";
      case depth > 70:
        return "#ff6600";
      case depth > 50:
        return "#ffcc00";
      case depth > 30:
        return "#ffff00";
      case depth > 10:
        return "#d4ee00";
      default:
        return "#91e600";
    }
  }

  // Determine the radius of Earthquake based on magnitude. 
  function getRadius(magnitude) {return magnitude * 3;
  }
  // ADD geoJSON layer to map.
  L.geoJson(data, {
    // Create a custom layer for each point feature. Represent each point as a circle. 
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set style for each circle using styleInfo and GeoJSON feature.
    style: styleInfo,
    // marker for each circle which has magnitude, depth and location
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
  }).addTo(map);

  // Put Legend in bottom right 
  let legend = L.control({
    position: "bottomright"
  });

  // Details for legend different sets of depths and colors
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    let intervals = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "#91e600",
      "#d4ee00",
      "#ffff00",
      "#ffcc00",
      "#ff6600",
      "#ff0000"
    ];

    // Loop for legend colored format
    for (let i = 0; i < intervals.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + intervals[i] + (intervals[i + 1] ? "&ndash;" + intervals[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // addition of legend to map
  legend.addTo(map);
});
