import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LayoutWeb from "../../../layouts/Web";
import Api from "../../../api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl:
    "https://uxwing.com/wp-content/themes/uxwing/download/location-travel-map/maps-pin-black-icon.png",
  iconSize: [30, 30],
  iconAnchor: [15, 45],
  popupAnchor: [0, -40],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [45, 45],
});

function WebPlaceShow() {
  const [place, setPlace] = useState({});
  const [loading, setLoading] = useState(true); // State untuk menandai loading data
  const { slug } = useParams();

  const fetchDataPlace = async () => {
    try {
      const response = await Api.get(`/api/web/places/${slug}`);
      setPlace(response.data.data);
      document.title = `${response.data.data.title} - Sistem Informasi Geografis Sekolah Menegah Pertama Negeri Kab. Bandung`;
    } catch (error) {
      console.error("Error fetching place data:", error);
    } finally {
      setLoading(false); // Set loading ke false setelah data berhasil atau gagal diambil
    }
  };

  useEffect(() => {
    fetchDataPlace();
  }, []);

  const isPositionValid =
    place.latitude &&
    place.longitude &&
    !isNaN(parseFloat(place.latitude)) &&
    !isNaN(parseFloat(place.longitude));

  const position = isPositionValid
    ? [parseFloat(place.latitude), parseFloat(place.longitude)]
    : null;

  return (
    <React.Fragment>
      <LayoutWeb>
        <div className="container mt-80">
          <div className="row">
            <div className="col-md-7 mb-4">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-body">
                  <h4>{place.title}</h4>
                  <span className="card-text">
                    <i className="fa fa-map-marker"></i> <i>{place.address}</i>
                  </span>
                  <hr />
                  <div
                    dangerouslySetInnerHTML={{ __html: place.description }}
                  />
                  {/* <div dangerouslySetInnerHTML={{ __html: place.latitude }} /> */}
                </div>
              </div>
            </div>
            <div className="col-md-5 mb-4">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-body">
                  <h5>
                    <i className="fa fa-map-marked-alt"></i> MAPS
                  </h5>
                  <hr />
                </div>
                <div className="card-body">
                  {/* Tampilkan loader atau pesan jika data sedang dimuat atau tidak tersedia */}
                  {loading ? (
                    <p>Loading map...</p>
                  ) : isPositionValid ? (
                    <MapContainer
                      center={position}
                      zoom={13}
                      style={{ height: "300px", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <Marker position={position} icon={customIcon}>
                        <Popup>{place.title}</Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <p>Location data is not available.</p>
                  )}
                  <div className="d-grid gap-2">
                    <Link
                      to={`/places/${place.slug}/direction?longitude=${place.longitude}&latitude=${place.latitude}`}
                      className="float-end btn btn-success btn-block btn-md mt-3"
                    >
                      <i className="fa fa-location-arrow"></i> OPEN DIRECTION
                    </Link>
                  </div>
                </div>
                <hr />
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-2 col-2">
                      <div className="icon-info-green">
                        <i className="fa fa-map-marker-alt"></i>
                      </div>
                    </div>
                    <div className="col-md-10 col-10">
                      <div className="capt-info fw-bold">ADDRESS</div>
                      <div className="sub-title-info">
                        <i>{place.address}</i>
                      </div>
                    </div>
                    <div className="col-md-2 col-2">
                      <div className="icon-info-green">
                        <i className="fa fa-clock"></i>
                      </div>
                    </div>
                    <div className="col-md-10 col-10">
                      <div className="capt-info fw-bold">OFFICE HOURS</div>
                      <div className="sub-title-info">{place.office_hours}</div>
                    </div>
                    <div className="col-md-2 col-2">
                      <div className="icon-info-green">
                        <i className="fa fa-phone"></i>
                      </div>
                    </div>
                    <div className="col-md-10 col-10">
                      <div className="capt-info fw-bold">PHONE</div>
                      <div className="sub-title-info">{place.phone}</div>
                    </div>
                    <div className="col-md-2 col-2">
                      <div className="icon-info-green">
                        <i className="fa fa-globe-asia"></i>
                      </div>
                    </div>
                    <div className="col-md-10 col-10">
                      <div className="capt-info fw-bold">WEBSITE</div>
                      <div className="sub-title-info">
                        <a
                          href={place.website}
                          className="text-decoration-none"
                        >
                          {place.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWeb>
    </React.Fragment>
  );
}

export default WebPlaceShow;
