import React, { useEffect, useState, useRef } from "react";
import LayoutWeb from "../../../layouts/Web";
import Api from "../../../api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function WebMapsIndex() {
  document.title = "Maps - TRAVEL GIS - Website Wisata Berbasis GIS";

  const mapContainer = useRef(null);
  const mapInstance = useRef(null); // Instance peta
  const [coordinates, setCoordinates] = useState([]);

  // Fungsi untuk mengambil data lokasi dari API
  const fetchDataPlaces = async () => {
    try {
      const response = await Api.get("/api/web/places");
      if (response.data.success && response.data.data.data) {
        setCoordinates(response.data.data.data);
      } else {
        console.warn("Data kosong atau tidak valid dari API.");
        setCoordinates([]);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      setCoordinates([]);
    }
  };

  // Inisialisasi peta saat pertama kali
  useEffect(() => {
    if (mapInstance.current) return; // Cegah inisialisasi ulang

    mapInstance.current = L.map(mapContainer.current).setView(
      [-7.059268, 107.652887], // Koordinat pusat awal peta
      10 // Zoom level
    );

    // Tambahkan tile layer OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    return () => {
      // Hapus instance map saat komponen unmount
      mapInstance.current?.remove();
    };
  }, []);

  // Menyiapkan ikon kustom untuk marker
  const customIcon = new L.Icon({
    iconUrl:
      "https://uxwing.com/wp-content/themes/uxwing/download/location-travel-map/maps-pin-black-icon.png", // Ganti dengan URL gambar ikon kustom
    iconSize: [32, 32], // Ukuran ikon
    iconAnchor: [16, 32], // Titik jangkar ikon, sesuaikan sesuai kebutuhan
    popupAnchor: [0, -32], // Titik popup, sesuaikan sesuai kebutuhan
  });

  // Tambahkan marker setiap kali koordinat berubah
  useEffect(() => {
    if (!coordinates || coordinates.length === 0 || !mapInstance.current)
      return;

    // Hapus semua marker sebelumnya
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Tambahkan marker baru
    coordinates.forEach((location) => {
      const { title, address, latitude, longitude, slug } = location;

      if (!latitude || !longitude) {
        console.warn("Data lokasi tidak valid:", location);
        return;
      }

      const popupContent = `
        <h6>${title}</h6>
        <hr/>
        <p><i class="fa fa-map-marker"></i> ${address}</p>
        <div class="d-grid gap-2 mt-2">
          <a href="/places/${slug}" class="btn btn-sm btn-success btn-block text-white">
            Lihat Selengkapnya
          </a>
        </div>
      `;

      // Tambahkan marker dengan ikon kustom
      L.marker([parseFloat(latitude), parseFloat(longitude)], {
        icon: customIcon,
      })
        .addTo(mapInstance.current)
        .bindPopup(popupContent);
    });
  }, [coordinates]);

  // Ambil data lokasi saat pertama kali komponen dirender
  useEffect(() => {
    fetchDataPlaces();
  }, []);

  return (
    <React.Fragment>
      <LayoutWeb>
        <div className="container mt-80">
          <div className="row">
            <div className="col-md-12 mb-5">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-body">
                  <h5>
                    <i className="fa fa-map-marked-alt"></i> SEMUA DATA VERSI
                    MAPS
                  </h5>
                  <hr />
                  <div
                    ref={mapContainer}
                    className="map-container"
                    style={{ height: "450px", width: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWeb>
    </React.Fragment>
  );
}

export default WebMapsIndex;
