document.addEventListener("DOMContentLoaded", function () {
  var mapEl = document.getElementById("map");
  var countryCard = document.getElementById("country-card");

  if (!mapEl || !countryCard || typeof L === "undefined") {
    if (typeof console !== "undefined") {
      console.warn("Atlas map dependencies are missing.");
    }
    return;
  }

  function renderLegend(data) {
    var legendEl = document.getElementById("atlas-legend");
    if (!legendEl) return;

    var seen = {};
    var items = [];

    data.features.forEach(function (feature) {
      var props = feature.properties || {};
      var country = props.country || "Location";
      var color = props.color || "#3388ff";

      if (!seen[color]) {
        seen[color] = true;
        items.push({ country: country, color: color });
      }
    });

    legendEl.innerHTML = "<h3>Journey Legend</h3><div class='legend-items'></div>";
    var list = legendEl.querySelector(".legend-items");

    items.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "legend-item";

      var swatch = document.createElement("span");
      swatch.className = "legend-swatch";
      swatch.style.backgroundColor = item.color;

      var label = document.createElement("span");
      label.textContent = item.country;

      row.appendChild(swatch);
      row.appendChild(label);
      list.appendChild(row);
    });
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
      renderLegend(data);

      var journeys = data.features.length;

      var photos = data.features.reduce(function (total, feature) {
        return total + (feature.properties.photos || 0);
      }, 0);

      var stops = data.features.reduce(function (total, feature) {
        return total + (feature.properties.route ? feature.properties.route.length : 0);
      }, 0);

      var myths = new Set(data.features.map(function (feature) {
        return feature.properties.myth;
      }));

      var statsEl = document.getElementById("atlas-stats");

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
              ? "<div class='route-chips'>" +
                  routeValues.map(function(stop) {
                   return "<span class='route-chip'>" +
                         stop +
                         "</span>";
                 }).join("")
                + "</div>"
              : "<p>No route details available.</p>";

            var stopCount = routeValues.length;

            countryCard.innerHTML =
              "<h2>" +
              (props.country || "Location").toUpperCase() +
             "</h2>" +
             "<p class='myth-thread'>" +
              (props.myth || "") +
              "</p>" +
              "<p><strong>Route:</strong></p>" +
              routeList +
              "<p class='journey-meta'>" +
              (props.year || "") +
              " • " +
              stopCount +
             " Stops • " +
             (props.photos || 0) +
             " Photos</p>" + "</p>" +
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