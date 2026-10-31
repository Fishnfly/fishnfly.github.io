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
  .then(function(response) {

    if (!response.ok) {
      throw new Error(
        "Failed to load atlas.geojson: " +
        response.status
      );
    }

    return response.json();

})

.then(function(data) {

  var journeys = data.features.length;

  var photos = data.features.reduce(function(total, feature) {
    return total + (feature.properties.photos || 0);
  }, 0);

  var stops = data.features.reduce(function(total, feature) {
    return total +
      (feature.properties.route
        ? feature.properties.route.length
        : 0);
  }, 0);

  var myths = new Set(
    data.features.map(function(feature) {
      return feature.properties.myth;
    })
  );

  var statsEl =
  document.getElementById("atlas-stats");

if (statsEl) {

  statsEl.innerHTML =

    "<div class='stat-box'>" +
      "<div class='stat-number'>" + journeys + "</div>" +
      "<div class='stat-label'>Journeys</div>" +
    "</div>" +

    "<div class='stat-box'>" +
      "<div class='stat-number'>" + stops + "</div>" +
      "<div class='stat-label'>Stops</div>" +
    "</div>" +

    "<div class='stat-box'>" +
      "<div class='stat-number'>" + photos + "</div>" +
      "<div class='stat-label'>Photos</div>" +
    "</div>" +

    "<div class='stat-box'>" +
      "<div class='stat-number'>" + myths.size + "</div>" +
      "<div class='stat-label'>Myth Threads</div>" +
    "</div>";

}

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

            var stopCount = routeValues.length;

            countryCard.innerHTML =
              "<h2>" + (props.country || "Location") + "</h2>" +
              "<p><strong>Myth Thread:</strong> " + (props.myth || "") + "</p>" +
              "<p><strong>Route:</strong></p>" +
              routeList +
              "<p><strong>Year:</strong> " + (props.year || "") + "</p>" +
              "<p><strong>Stops:</strong> " + stopCount + "</p>" +
              "<p><strong>Photos:</strong> " + (props.photos || "") + "</p>" +
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