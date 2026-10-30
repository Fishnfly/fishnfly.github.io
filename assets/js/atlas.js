document.addEventListener("DOMContentLoaded", function () {

  const map = L.map("map").setView([20, 0], 2);

  L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap"
    }
  ).addTo(map);

  fetch("/assets/data/atlas.geojson")
    .then(response => response.json())
    .then(data => {

      const atlasLayer = L.geoJSON(data, {

        pointToLayer: function (feature, latlng) {

          return L.circleMarker(latlng, {
            radius: 8,
            fillColor:
              feature.properties.color || "#3388ff",
            color: "#ffffff",
            weight: 2,
            fillOpacity: 0.9
          });

        },

        onEachFeature: function (feature, layer) {

          layer.on("click", function () {

            const props =
              feature.properties || {};

            document.getElementById(
              "country-card"
            ).innerHTML =

              "<h2>" +
              (props.country || "Location") +
              "</h2>" +

              "<p><strong>Myth Thread:</strong> " +
              (props.myth || "") +
              "</p>" +

              "<p><strong>Route:</strong><br>" +
              (props.route || "") +
              "</p>" +

              "<p><strong>Photos:</strong> " +
              (props.photos || "") +
              "</p>" +

              "<p><strong>Year:</strong> " +
              (props.year || "") +
              "</p>" +

              "<p><a href='" +
              (props.story || "#") +
              "'>Read Journey</a></p>";

          });

        }

      });

      atlasLayer.addTo(map);

      const bounds =
        atlasLayer.getBounds();

      if (bounds.isValid()) {

        map.fitBounds(
          bounds.pad(0.30)
        );

      }

    });

});