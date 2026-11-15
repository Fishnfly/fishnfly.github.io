document.addEventListener("DOMContentLoaded", function () {
  var mapEl = document.getElementById("map");
  var countryCard = document.getElementById("country-card");

  var currentRouteLine = null;
  var currentStopMarkers = [];
  var atlasLayer = null;

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

    return routeCoords
      .filter(function (coord) {
        return Array.isArray(coord) && coord.length >= 2 && !isNaN(coord[0]) && !isNaN(coord[1]);
      })
      .map(function (coord) {
        return [coord[1], coord[0]];
      });
  }

  function clearActiveRoute() {
    if (currentRouteLine) {
      map.removeLayer(currentRouteLine);
      currentRouteLine = null;
    }

    currentStopMarkers.forEach(function (marker) {
      map.removeLayer(marker);
    });
    currentStopMarkers = [];
  }

  function drawRoute(feature) {
    clearActiveRoute();

    var props = feature.properties || {};
    var routeCoords = normalizeRouteCoords(props.routeCoords);
    var routeStops = normalizeRoute(props.route);
    var routeImages = Array.isArray(props.images) ? props.images : [];
    var routeColor = props.color || "#3388ff";
    var safeColor = escapeHtml(routeColor);
    var safeStory = escapeHtml(props.story || "#");

    if (routeCoords.length < 2) {
      return;
    }

    currentRouteLine = L.polyline(routeCoords, {
      color: routeColor,
      weight: 3,
      opacity: 0.85
    }).addTo(map);

    map.fitBounds(currentRouteLine.getBounds().pad(0.20));

    routeCoords.forEach(function (coord, index) {
      var isEndpoint = index === 0 || index === routeCoords.length - 1;
      var stopName = escapeHtml(routeStops[index] || ("Stop " + (index + 1)));
      var stopImage = routeImages[index] ? escapeHtml(routeImages[index]) : "";

      var stopMarker = L.circleMarker(coord, {
        radius: isEndpoint ? 8 : 5,
        color: "#ffffff",
        weight: 2,
        fillColor: routeColor,
        fillOpacity: 1
      });

      stopMarker.bindTooltip(stopName, {
        direction: "top"
      });

      var popupContent = "<div style='text-align: center; min-width: 150px;'>";
      if (stopImage) {
        popupContent += "<img src='" + stopImage + "' alt='" + stopName + "' style='width: 160px; height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 6px; display: block; margin-left: auto; margin-right: auto;' />";
      }
      popupContent += "<h4 style='margin: 0 0 4px 0; font-size: 14px;'>" + stopName + "</h4>";
      popupContent += "<a href='" + safeStory + "' style='font-size: 12px; color: " + safeColor + "; text-decoration: none;'>Read Field Notes →</a>";
      popupContent += "</div>";

      stopMarker.bindPopup(popupContent);
      stopMarker.addTo(map);

      stopMarker.on("click", function () {
        setActiveChip(index);
      });

      currentStopMarkers.push(stopMarker);
    });
  }

  function setActiveChip(activeIndex) {
    countryCard.querySelectorAll(".route-chip").forEach(function (chip) {
      var chipIndex = parseInt(chip.getAttribute("data-stop-index"), 10);
      chip.classList.toggle("active", chipIndex === activeIndex);
    });
  }

  function focusStop(index) {
    var marker = currentStopMarkers[index];
    if (!marker) return;

    setActiveChip(index);

    var targetLatLng = marker.getLatLng();
    var targetZoom = Math.max(map.getZoom(), 8);

    map.once("moveend", function () {
      marker.openPopup();
    });

    map.flyTo(targetLatLng, targetZoom, {
      duration: 0.75
    });
  }

  function renderJourneyCard(feature) {
    var props = feature.properties || {};

    if (props.routeCoords) {
      drawRoute(feature);
    } else {
      clearActiveRoute();
    }

    var routeValues = normalizeRoute(props.route);
    var title = escapeHtml((props.journey || props.country || "Location").toUpperCase());

    var routeList = routeValues.length
      ? "<div class='route-chips'>" +
          routeValues.map(function (stop, index) {
            return "<button type='button' class='route-chip' data-stop-index='" + index + "'>" +
                   escapeHtml(stop) +
                   "</button>";
          }).join("") +
        "</div>"
      : "<p>No route details available.</p>";

    countryCard.innerHTML =
      "<h2>" + title + "</h2>" +
      "<p class='myth-thread'>" + escapeHtml(props.myth || "") + "</p>" +
      "<p><strong>Route:</strong></p>" +
      routeList +
      "<p class='journey-meta'>" + escapeHtml(props.year || "") + " • " + routeValues.length + " Stops • " + escapeHtml(props.photos || 0) + " Photos</p>" +
      "<p><a href='" + escapeHtml(props.story || "#") + "'>Read Journey</a></p>";

    countryCard.querySelectorAll(".route-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var index = parseInt(this.getAttribute("data-stop-index"), 10);
        focusStop(index);
      });
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

    legendEl.innerHTML = "<div class='legend-items'>" + items.join("") + "</div>";

    legendEl.querySelectorAll(".legend-filter").forEach(function (filterBtn) {
      filterBtn.addEventListener("click", function () {
        legendEl.querySelectorAll(".legend-filter").forEach(function (el) {
          el.classList.remove("active");
        });
        this.classList.add("active");

        clearActiveRoute();

        var matches = data.features.filter(function (feature) {
  return selectedMyth === "all" ||
         (feature.properties && feature.properties.myth === selectedMyth);
});

if (selectedMyth === "all") {

  countryCard.innerHTML =
    "<h2>Select a Destination</h2>" +
    "<p>Choose a marker or myth thread.</p>";

  return;
}

if (matches.length) {
  renderJourneyCard(matches[0]);
}
      });
    });
  }

  function renderGeoJsonLayer(data, filterMyth) {
    if (atlasLayer) {
      map.removeLayer(atlasLayer);
    }

    atlasLayer = L.geoJSON(data, {
      filter: function (feature) {
        if (!filterMyth || filterMyth === "all") return true;
        var myth = (feature.properties && feature.properties.myth) || "Unknown";
        return myth === filterMyth;
      },
      pointToLayer: function (feature, latlng) {
        var props = feature.properties || {};
        return L.circleMarker(latlng, {
          radius: 8,
          color: "#ffffff",
          weight: 2,
          fillColor: props.color || "#3388ff",
          fillOpacity: 0.9
        });
      },
      onEachFeature: function (feature, layer) {
        var props = feature.properties || {};
        var label = props.journey || props.country;
        if (label) {
          layer.bindTooltip(escapeHtml(label), { direction: "top" });
        }
        layer.on("click", function () {
          renderJourneyCard(feature);
        });
      }
    }).addTo(map);

    var bounds = atlasLayer.getBounds();

if (bounds.isValid() && filterMyth === "all") {
  map.fitBounds(bounds.pad(0.30));
}
  }

  fetch("/assets/data/atlas.geojson")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load atlas.geojson: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      renderLegend(data);
      renderGeoJsonLayer(data, "all");

      var journeys = data.features.length;
      var photos = data.features.reduce(function (total, feature) {
        return total + ((feature.properties && feature.properties.photos) || 0);
      }, 0);
      var stops = data.features.reduce(function (total, feature) {
        return total + (feature.properties && feature.properties.route ? normalizeRoute(feature.properties.route).length : 0);
      }, 0);
      var myths = new Set(data.features.map(function (feature) {
        return feature.properties && feature.properties.myth;
      }).filter(Boolean));

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
          window.location.href = choice.properties.story;
        });
      }
    })
    .catch(function (error) {
      console.error("Error loading Atlas data:", error);
    });
});
