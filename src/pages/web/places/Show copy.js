// import hook react
import React, { useEffect, useState } from "react";

// import react router dom
import { Link, useParams } from "react-router-dom";

// import layout web
import LayoutWeb from "../../../layouts/Web";

// import BASE URL API
import Api from "../../../api";

// import Leaflet components
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define custom marker icon using the URL you provided
const customIcon = new L.Icon({
  iconUrl:
    "https://uxwing.com/wp-content/themes/uxwing/download/location-travel-map/maps-pin-black-icon.png",
  iconSize: [30, 30], // adjust size as needed
  iconAnchor: [15, 45], // center icon at bottom
  popupAnchor: [0, -40], // adjust so popup opens above the icon
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [45, 45],
});

function WebPlaceShow() {
  // state place
  const [place, setPlace] = useState({});

  // slug params
  const { slug } = useParams();

  // function "fetchDataPlace"
  const fetchDataPlace = async () => {
    // fetching Rest API
    await Api.get(`/api/web/places/${slug}`).then((response) => {
      // set data to state "places"
      setPlace(response.data.data);

      // set title from state "category"
      document.title = `${response.data.data.title} - Website Wisata Berbasis GIS (Geographic Information System)`;
    });
  };

  // hook
  useEffect(() => {
    // call function "fetchDataPlace"
    fetchDataPlace();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Latitude and Longitude
  const position = [parseFloat(place.latitude), parseFloat(place.longitude)];

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
                  {/* Leaflet Map */}
                  <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: "300px", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={position} icon={customIcon}>
                      <Popup>{place.title}</Popup>
                    </Marker>
                  </MapContainer>
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
