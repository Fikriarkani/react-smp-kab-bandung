import React, { useEffect, useState, useRef } from "react";
import LayoutWeb from "../../../layouts/Web";
import Api from "../../../api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { bdgData } from "../../../data/kecBandung"; // Mengimpor data GeoJSON
import "../../../styles/legend.css"; // Mengimpor CSS legenda

function WebMapsIndex() {
  document.title =
    "Maps - Sistem Informasi Geografis Sekolah Menegah Pertama Negeri Kab. Bandung";

  // Fungsi untuk mendapatkan warna berdasarkan jumlah SMP
  function getColor(jmlhSMP) {
    return jmlhSMP > 13.98 ? "#00FF00" : jmlhSMP >= 9.5 ? "#FFFF00" : "#FF0000";
  }

  // Fungsi untuk menentukan style pada setiap feature GeoJSON
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

  const mapContainer = useRef(null);
  const mapInstance = useRef(null); // Instance peta
  const [coordinates, setCoordinates] = useState([]);
  const [legendVisible, setLegendVisible] = useState(false); // State untuk kontrol visibility legenda
  const [page, setPage] = useState(1); // State untuk melacak halaman

  // Fungsi untuk mengambil data lokasi dari API dengan paginasi
  const fetchDataPlaces = async () => {
    try {
      const response = await Api.get("/api/web/places", {
        params: { per_page: 50, page: page }, // Menambahkan per_page dan page
      });

      if (response.data.success && response.data.data.data) {
        setCoordinates((prevCoordinates) => [
          ...prevCoordinates,
          ...response.data.data.data,
        ]);

        // Jika ada halaman berikutnya, perbarui halaman dan panggil lagi
        if (response.data.data.next_page_url) {
          setPage(page + 1); // Pindah ke halaman berikutnya
        }
      } else {
        console.warn("Data kosong atau tidak valid dari API.");
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  // Inisialisasi peta saat pertama kali
  useEffect(() => {
    if (!mapContainer.current) return; // Pastikan elemen DOM sudah ada

    mapInstance.current = L.map(mapContainer.current).setView(
      [-7.059268, 107.652887], // Koordinat pusat awal peta
      10 // Zoom level
    );

    // Tambahkan tile layer OpenStreetMap
    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
      }
    ).addTo(mapInstance.current);

    // Menambahkan kontrol layer
    var baseLayers = {
      OpenStreetMap: osm,
    };

    const wilBdg = L.geoJSON(bdgData, {
      style: style,
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties["KECAMATAN"]) {
          layer.bindPopup(
            "Kecamatan: " +
              feature.properties["KECAMATAN"] +
              "<br>Jumlah Sekolah: " +
              feature.properties["jumlah_smp"]
          );
        }
      },
    });

    var overlays = {
      "Sekolah Per Kecamatan": wilBdg,
    };

    const layersControl = L.control
      .layers(baseLayers, overlays, { collapsed: false })
      .addTo(mapInstance.current);

    // Menambahkan legenda
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 9.5, 13.98], // Rentang kelas
        labels = [];

      // Loop untuk membuat rentang legenda
      for (var i = 0; i < grades.length; i++) {
        var color = getColor(grades[i] + 1); // Menggunakan nilai lebih besar untuk mendapatkan warna yang benar
        var label = "";

        // Menentukan label berdasarkan nilai
        if (grades[i] < 9.5) {
          label = "< ";
        } else if (grades[i] < 13.98) {
          label = "9.5 - ";
        } else {
          label = "";
        }

        // Menambahkan rentang legenda dan warna
        div.innerHTML += '<i style="background:' + color + '"></i> ' + label;

        // Menambahkan rentang untuk nilai berikutnya dengan tanda hubung tengah jika perlu
        if (grades[i + 1]) {
          div.innerHTML += grades[i + 1] + "<br>";
        } else {
          div.innerHTML += "> 13.98";
        }
      }

      return div;
    };

    // Mengontrol visibilitas legenda secara manual
    mapInstance.current.on("layeradd", function (e) {
      if (e.layer === wilBdg) {
        legend.addTo(mapInstance.current);
        setLegendVisible(true); // Tampilkan legenda
      }
    });

    mapInstance.current.on("layerremove", function (e) {
      if (e.layer === wilBdg) {
        mapInstance.current.removeControl(legend);
        setLegendVisible(false); // Sembunyikan legenda
      }
    });

    // Hapus instance map saat komponen unmount
    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  // Menambahkan marker dengan data lokasi
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
        <p><i className="fa fa-map-marker"></i> ${address}</p>
        <div className="d-grid gap-2 mt-2">
          <a href="/places/${slug}" className="btn btn-sm btn-success btn-block text-white">
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
    fetchDataPlaces(); // Panggil fungsi untuk mengambil data pertama kali
  }, [page]); // Panggil kembali ketika halaman berubah

  // Menambahkan ikon kustom untuk marker
  const customIcon = new L.Icon({
    iconUrl:
      "https://uxwing.com/wp-content/themes/uxwing/download/location-travel-map/maps-pin-black-icon.png", // Ganti dengan URL gambar ikon kustom
    iconSize: [32, 32], // Ukuran ikon
    iconAnchor: [16, 32], // Titik jangkar ikon
    popupAnchor: [0, -32], // Titik popup
  });

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
