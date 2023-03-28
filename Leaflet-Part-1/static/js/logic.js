//function createMap(earthquakemaps) {

    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  // Adding tile layers
    var satellitemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the streetmap layer.
    var baseMaps = {
      "Street Map": streetmap,
      "Satellite Map":satellitemap
    };
    // Initialize LayerGroups
    var earthquakemap = new L.LayerGroup();

    // Create an overlayMaps object to hold the earthquakemap layer.
    var overlayMaps = {
      "Earth Quake Map Layer": earthquakemap
    };
    

    // Create the map object with options.
    var map = L.map("map", {
      center: [34.87521787757376,-109.05916325],
      zoom: 5,
      layers: [streetmap, earthquakemap]
    });
  
    // Create a layer control, and pass it  baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  //}

    // Perform an API call to the USGS API to get the earthquake information. 
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function(data){
    console.log(data.features);
    // Creating a GeoJSON layer with the retrieved data.
    //L.geoJSON(data).addTo(map);
    
    function chooseColor(magnitude) {
        switch (true) { 
        case magnitude < 1:
        return "#66ec6f";
        case magnitude < 2:
        return "#f1fe4c";
        case magnitude < 3:
        return "#feb988";
        case magnitude < 4:
        return "#fc4e2a";
        case magnitude < 5:
        return "#e31a1c";
        default:
        return "#b10026";
        };
}
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
        // pointToLayer function for circle markers and geojson
        // Source link: https://leafletjs.com/examples/geojson/
        pointToLayer: function(feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
        style: function(feature) {
        return {
            color: "#000000",
            fillColor: chooseColor(feature.properties.mag),
            fillOpacity: 0.8,
            weight: 0.5,
            stroke: true,
            radius: (feature.properties.mag) * 7
        };
        },
        onEachFeature: function(feature, layer) {
        layer.bindPopup
        (`<strong>Location: </strong>${feature.properties.place}<hr><strong>Time: </strong>${new Date(feature.properties.time)}<br><strong>Magnitude: </strong>${feature.properties.mag}`);
        }
    }).addTo(map); 
    
    // Set up the legend
    // Link source: https://leafletjs.com/examples/choropleth/
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var magnitudeLabels = [-1,1,2,3,4,5];

        var legendInfo = "<strong><center>Magnitude<br>Level</center></strong>" + "<div class=\"labels\">" + "</div>";
        
        div.innerHTML = legendInfo;

        for (var i = 0; i < magnitudeLabels.length; i++) {
            div.innerHTML += 
                '<i style="background:'+ chooseColor(magnitudeLabels[i] + 1) + '"></i> ' +
                magnitudeLabels[i] + (magnitudeLabels[i + 1] ? ' &ndash; ' + magnitudeLabels[i + 1] + '<br>' : ' +');
        }
        // Set the background of the div to white
            div.style.backgroundColor = "#ffffff";
        return div;
    };
    legend.addTo(map);
    });



//});

    