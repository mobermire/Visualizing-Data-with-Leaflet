var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(magnitude) {
    return magnitude * 4;
};


var earthquakes = new L.LayerGroup();

d3.json(queryUrl, function (response) {
    L.geoJson(response.features, {
        pointToLayer: function (point, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(point.properties.mag) });
        },

        style: function (features) {
            return {
                fillColor: Color(features.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'none'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4>" + feature.properties.place +
                "</h4> <hr> <h4>" + `Magnitude ${feature.properties.mag}` + "</h4>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});


function Color(magnitude) {
    if (magnitude >= 5) {
        return '#ff0000'
    } else if (magnitude >= 4) {
        return '#ff3333'
    } else if (magnitude >= 3) {
        return '#ff6666'
    } else if (magnitude >= 2) {
        return '#ff9999'
    } else if (magnitude >= 1) {
        return '#ffcccc'
    } else {
        return '#ffffff'
    }
};

function createMap() {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

    var baseLayers = {
        "Street": streetmap,
    };

    var overlays = {
        "Earthquakes": earthquakes,
    };

    var mymap = L.map('map-id', {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);
// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    var div = L.DomUtil.create('div','info legend'),
    magnitudes = [0,1,2,3,4,5],
    labels = [];

div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>" 
// loop through our density intervals and generate a label for each interval
for (var i=0; i < magnitudes.length; i++){
  div.innerHTML +=
    '<i style="background:' + Color(magnitudes[i] + 1) + '"></i> ' +
    magnitudes[i] + (magnitudes[i+1]?'&ndash;' + magnitudes[i+1] +'<br>': '+');
  }
  return div;}
legend.addTo(mymap);
}    

