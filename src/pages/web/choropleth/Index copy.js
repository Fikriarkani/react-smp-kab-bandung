import React, { useEffect } from "react";
import LayoutWeb from "../../../layouts/Web";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Mengimpor CSS Leaflet

function WebChoroplethIndex() {
  useEffect(() => {
    // Membuat peta dan menambahkan layer
    const map = L.map("map").setView([51.505, -0.09], 13);

    // OSM layer
    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Menambahkan marker dengan ikon default
    const defaultIcon = new L.Icon({
      iconUrl: require("leaflet/dist/images/marker-icon.png"), // Pastikan jalur ini benar jika menggunakan file lokal
      iconSize: [25, 41], // Ukuran default marker
      iconAnchor: [12, 41], // Tempat pelekatan di marker
      popupAnchor: [1, -34], // Penempatan popup relatif ke marker
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"), // Bayangan untuk marker
      shadowSize: [41, 41], // Ukuran bayangan
    });

    const marker = L.marker([51.505, -0.09], { icon: defaultIcon }).addTo(map);
    marker.bindPopup("England");

    // Menambahkan layer Stamen Watercolor
    const stamenLayer = L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}",
      {
        minZoom: 1,
        maxZoom: 16,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: "jpg",
      }
    );
    // stamenLayer.addTo(map);

    // Membersihkan peta saat komponen di-unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <React.Fragment>
      <LayoutWeb>
        <div className="container mt-80">Halaman Maps Choropleth</div>
        <div id="map" style={{ height: "100vh", width: "100%" }}></div>
      </LayoutWeb>
    </React.Fragment>
  );
}

export default WebChoroplethIndex;
