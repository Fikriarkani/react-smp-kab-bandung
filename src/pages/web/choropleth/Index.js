import React, { useEffect } from "react";
import LayoutWeb from "../../../layouts/Web";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Mengimpor CSS Leaflet
import { bdgData } from "../../../data/kecBandung"; // Mengimpor data GeoJSON
import "../../../styles/legend.css"; // Mengimpor CSS legenda
import { smpDat } from "../../../data/smp";

function WebChoroplethIndex() {
  useEffect(() => {
    function getColor(jmlhSMP) {
      return jmlhSMP > 13.98
        ? "#00FF00"
        : jmlhSMP >= 9.5
        ? "#FFFF00"
        : "#FF0000";
    }

    function style(feature) {
      return {
        fillColor: getColor(feature.properties.jumlah_smp),
        weight: 1,
        opacity: 1,
        color: "black",
        dashArray: "1",
        fillOpacity: 0.7,
      };
    }

    // Membuat peta dan menambahkan layer
    const map = L.map("map").setView([-7.059268, 107.652887], 10);

    // OSM layer
    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Menambahkan layer GeoJSON
    const wilBdg = L.geoJSON(bdgData, {
      style: style,
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties["KECAMATAN"]) {
          layer.bindPopup(
            "Kecamatan: " +
              feature.properties["KECAMATAN"] +
              "<br>Jumlah Sekolah: " +
              feature.properties["jumlah_smp"] +
              ""
          );
        }
      },
    }).addTo(map);

    // Membuat legend
    var legend = L.control({
      position: "bottomright",
    });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

      // Loop untuk membuat label dengan warna yang sesuai
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getColor(grades[i] + 1) +
          '"></i> ' +
          grades[i] +
          (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }

      return div;
    };

    legend.addTo(map);

    var baseLayers = {
      OpenStreetMap: osm,
    };

    var overlays = {
      "Sebaran Perkecamatan": wilBdg,
    };

    L.control.layers(baseLayers, overlays).addTo(map);

    // Membersihkan peta saat komponen di-unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <React.Fragment>
      <LayoutWeb>
        <div
          className="container mt-80"
          id="map"
          style={{ height: "80vh", width: "100%" }}
        ></div>
      </LayoutWeb>
    </React.Fragment>
  );
}

export default WebChoroplethIndex;
