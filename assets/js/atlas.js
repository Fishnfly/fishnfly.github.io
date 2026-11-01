document.addEventListener("DOMContentLoaded", function () {
  var mapEl = document.getElementById("map");
  var countryCard = document.getElementById("country-card");

  var currentRouteLine = null;
  var currentStopMarkers = [];

  if (!mapEl || !countryCard || typeof L === "undefined") {
    if (typeof console !== "undefined") {
      console.warn("Atlas map dependencies are missing.");
    }
    return;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
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

  function normalizeRouteCoords(routeCoords) {
    if (!Array.isArray(routeCoords)) {
      return [];
    }

    return routeCoords.filter(function (coord) {
      return Array.isArray(coord) && coord.length >= 2 && !isNaN(coord[0]) && !isNaN(coord[1]);
    }).map(function (coord) {
      return [coord[1], coord[0]];
    });
  }

  function drawRoute(feature) {

  if (currentRouteLine) {

  map.removeLayer(currentRouteLine);
  currentRouteLine = null;

}

  currentStopMarkers.forEach(function(marker) {
    map.removeLayer(marker);
  });

  currentStopMarkers = [];

  var props = feature.properties || {};

  var routeCoords =
    normalizeRouteCoords(
      props.routeCoords
    );

  var routeStops =
    normalizeRoute(
      props.route
    );

  if (routeCoords.length < 2) {
    return;
  }

  currentRouteLine = L.polyline(routeCoords, {
    color: props.color || "#3388ff",
    weight: 2,
    opacity: 0.45,
    dashArray: "8 10"
  });

  currentRouteLine.addTo(map);

  routeCoords.forEach(function(coord, index) {

    var stopMarker = L.circleMarker(coord, {
      radius: 4,
      color: "#ffffff",
      weight: 1.5,
      fillColor: props.color || "#3388ff",
      fillOpacity: 0.9
    });

    stopMarker.bindPopup(
      routeStops[index] ||
      ("Stop " + (index + 1))
    );

    stopMarker.addTo(map);

    currentStopMarkers.push(stopMarker);

  });

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
      var mythValue = escapeHtml(myth);

      if (!seen[myth]) {
        seen[myth] = true;
        items.push(
          "<div class='legend-item legend-filter' data-myth='" + mythValue + "'>" +
          "<span class='legend-swatch' style='background-color:" + escapeHtml(color) + "'></span>" +
          "<span>" + mythValue + "</span>" +
          "</div>"
        );
      }
    });

    legendEl.innerHTML = items.join("");
  }

  function renderJourneyCard(feature) {
    var props = feature.properties || {};

    if (feature.geometry && feature.geometry.coordinates) {
      map.setView([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0]
      ], 5);
    }

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
            drawRoute(feature);
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

        if (currentRouteLine) {
          map.removeLayer(currentRouteLine);
          currentRouteLine = null;
        }

        currentStopMarkers.forEach(function (marker) {
          map.removeLayer(marker);
        });
        currentStopMarkers = [];

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
          drawRoute(firstMatch);
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