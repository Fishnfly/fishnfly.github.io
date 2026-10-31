document.addEventListener("DOMContentLoaded", function () {
  var mapEl = document.getElementById("map");
  var countryCard = document.getElementById("country-card");

  if (!mapEl || !countryCard || typeof L === "undefined") {
    if (typeof console !== "undefined") {
      console.warn("Atlas map dependencies are missing.");
    }
    return;
  }

  function normalizeRoute(route) {
    if (Array.isArray(route)) {
      return route.filter(Boolean);
    }

    if (typeof route === "string") {
      return route.split("→").map(function (stop) {
        return stop.trim();
      }).filter(Boolean);
    }

    return [];
  }

  function renderLegend(data) {
    var legendEl = document.getElementById("atlas-legend");
    if (!legendEl) return;

    var seen = {};
    var items = [
      "<div class='legend-item legend-filter active' data-myth='all'>All Threads</div>"
    ];

    data.features.forEach(function (feature) {
      var props = feature.properties || {};
      var myth = props.myth || "Unknown";
      var color = props.color || "#3388ff";

      if (!seen[myth]) {
        seen[myth] = true;
        items.push(
          "<div class='legend-item legend-filter' data-myth='" + myth + "'>" +
          "<span class='legend-swatch' style='background-color:" + color + "'></span>" +
          "<span>" + myth + "</span>" +
          "</div>"
        );
      }
    });

    legendEl.innerHTML = items.join("");
  }

  function renderJourneyCard(feature) {
    var props = feature.properties || {};
    var routeValues = normalizeRoute(props.route);
    var routeList = routeValues.length
      ? "<div class='route-chips'>" + routeValues.map(function (stop) {
          return "<span class='route-chip'>" + stop + "</span>";
        }).join("") + "</div>"
      : "<p>No route details available.</p>";

    countryCard.innerHTML =
      "<h2>" + (props.country || "Location").toUpperCase() + "</h2>" +
      "<p class='myth-thread'>" + (props.myth || "") + "</p>" +
      "<p><strong>Route:</strong></p>" +
      routeList +
      "<p class='journey-meta'>" + (props.year || "") + " • " + routeValues.length + " Stops • " + (props.photos || 0) + " Photos</p>" +
      "<p><a href='" + (props.story || "#") + "'>Read Journey</a></p>";
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
        return total + (feature.properties.route ? normalizeRoute(feature.properties.route).length : 0);
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

      var randomButton = document.getElementById("random-journey");
      if (randomButton) {
        randomButton.addEventListener("click", function () {
          var choices = data.features.filter(function (feature) {
            return feature && feature.properties && feature.properties.story;
          });
          if (!choices.length) return;

          var choice = choices[Math.floor(Math.random() * choices.length)];
          if (choice.properties.story) {
            window.location.href = choice.properties.story;
          }
        });
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
            renderJourneyCard(feature);
          });
        }
      });

      atlasLayer.addTo(map);

      var worldBounds = atlasLayer.getBounds();
      if (worldBounds.isValid()) {
        map.fitBounds(worldBounds.pad(0.30));
      }

      function applyMythFilter(selectedMyth) {
        atlasLayer.clearLayers();

        var filteredFeatures = selectedMyth === "all"
          ? data.features
          : data.features.filter(function (feature) {
              return (feature.properties || {}).myth === selectedMyth;
            });

        atlasLayer.addData({
          type: "FeatureCollection",
          features: filteredFeatures
        });

        if (selectedMyth === "all") {

  if (worldBounds.isValid()) {
    map.fitBounds(worldBounds.pad(0.30));
  }

  countryCard.innerHTML =
    "<h2>Select a Destination</h2>" +
    "<p>Click a marker on the map.</p>";

  return;

}

        var firstMatch = filteredFeatures[0];
        if (firstMatch) {
          renderJourneyCard(firstMatch);
        }

        var filteredBounds = atlasLayer.getBounds();
        if (filteredBounds.isValid()) {
          map.setView(filteredBounds.getCenter(), 5);
        }
      }

      document.querySelectorAll(".legend-filter").forEach(function (item) {
        item.addEventListener("click", function () {
          document.querySelectorAll(".legend-filter").forEach(function (filter) {
            filter.classList.remove("active");
          });

          this.classList.add("active");
          applyMythFilter(this.getAttribute("data-myth"));
        });
      });
    })
    .catch(function (error) {
      if (typeof console !== "undefined") {
        console.error("Atlas map failed to load:", error);
      }
      countryCard.innerHTML = "<p>Map data could not be loaded.</p>";
    });
});