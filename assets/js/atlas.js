document.addEventListener("DOMContentLoaded", function () {
  var mapEl = document.getElementById("map");
  var countryCard = document.getElementById("country-card");

  if (!mapEl || !countryCard || typeof L === "undefined") {
    if (typeof console !== "undefined") {
      console.warn("Atlas map dependencies are missing.");
    }
    return;
  }

  var map = L.map("map").setView([20, 0], 2);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  fetch("/assets/data/atlas.geojson")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load atlas.geojson: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      var atlasLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: feature.properties.color || "#3388ff",
            color: "#ffffff",
            weight: 2,
            fillOpacity: 0.9
          });
        },

        onEachFeature: function (feature, layer) {
          layer.on("click", function () {
            var props = feature.properties || {};
            var routeValues = [];

            if (Array.isArray(props.route)) {
              routeValues = props.route;
            } else if (typeof props.route === "string") {
              routeValues = props.route.split("→").map(function (stop) {
                return stop.trim();
              }).filter(function (stop) {
                return Boolean(stop);
              });
            }

            var routeList = routeValues.length
              ? "<ul>" + routeValues.map(function (stop) {
                  return "<li>" + stop + "</li>";
                }).join("") + "</ul>"
              : "<p>No route details available.</p>";

            countryCard.innerHTML =
              "<h2>" + (props.country || "Location") + "</h2>" +
              "<p><strong>Myth Thread:</strong> " + (props.myth || "") + "</p>" +
              "<p><strong>Route:</strong></p>" +
              routeList +
              "<p><strong>Photos:</strong> " + (props.photos || "") + "</p>" +
              "<p><strong>Year:</strong> " + (props.year || "") + "</p>" +
              "<p><a href='" + (props.story || "#") + "'>Read Journey</a></p>";
          });
        }
      });

      atlasLayer.addTo(map);

      var bounds = atlasLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.30));
      }
    })
    .catch(function (error) {
      if (typeof console !== "undefined") {
        console.error("Atlas map failed to load:", error);
      }
      countryCard.innerHTML = "<p>Map data could not be loaded.</p>";
    });
});