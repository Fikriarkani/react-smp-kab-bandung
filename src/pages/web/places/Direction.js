import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import LayoutWeb from "../../../layouts/Web";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Custom hook to add routing
const RoutingMachine = ({ start, end }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!start || !end) return;

    // If routingControl already exists, remove it before creating a new one
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Create the routing control
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[1], start[0]), L.latLng(end[1], end[0])],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
      },
      createMarker: () => null, // Optional: remove markers
    }).addTo(map);

    // Store the reference to routingControl
    routingControlRef.current = routingControl;

    // Cleanup on component unmount or when start/end change
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [start, end, map]);

  return null;
};

function WebPlaceDirection() {
  document.title =
    "Map Direction - Sistem Informasi Geografis Sekolah Menegah Pertama Kab. Bandung";

  const mapRef = useRef();
  const [userLocation, setUserLocation] = useState(null);
  const { slug } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const destination = [
    parseFloat(query.get("longitude")),
    parseFloat(query.get("latitude")),
  ];

  useEffect(() => {
    const geoWatchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.error("Error getting user location", error);
        // Set a default location if permission is denied or an error occurs
        //setUserLocation([110.7241664, -6.9515962]);
      }
    );

    // Cleanup on unmount
    return () => navigator.geolocation.clearWatch(geoWatchId);
  }, []);

  return (
    <React.Fragment>
      <LayoutWeb>
        <div className="container mt-80">
          <div className="row">
            <div className="col-md-12 mb-5">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-body">
                  <Link
                    to={`/places/${slug}`}
                    className="float-end btn btn-success btn-sm mb-2"
                  >
                    <i className="fa fa-long-arrow-alt-left"></i> BACK TO PLACE
                  </Link>
                  <h5>
                    <i className="fa fa-location-arrow"></i> DIRECTION FROM USER
                    LOCATION
                  </h5>
                  <hr />
                  <div style={{ height: "400px" }}>
                    {userLocation && (
                      <MapContainer
                        center={userLocation}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                        ref={mapRef}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        <RoutingMachine
                          start={userLocation}
                          end={destination}
                        />
                      </MapContainer>
                    )}
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

export default WebPlaceDirection;
