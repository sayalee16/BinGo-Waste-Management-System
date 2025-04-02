import {MapContainer, TileLayer, Marker, Popup, useMap, Polyline} from "react-leaflet";
import L from "leaflet";
import { useState, useRef, useEffect } from "react";
import dusbinData from "./../../../../data/waste_bin_data.json";
import axios from "axios";

//dustbin icons
const icons = {
    recycled: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      iconSize: [25, 41],
    }),
    partially_filled: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
      iconSize: [25, 41],
    }),
    filled: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      iconSize: [25, 41],
    }),
};

// Custom user location icon
const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize: [25, 41],
});

function UserLocation({ onPositionChange }) {
    const [position, setPosition] = useState(null);
    const [tracking, setTracking] = useState(false);
    const map = useMap();
    const watchIdRef = useRef(null);
  
    const startTracking = () => {
      if (navigator.geolocation) {
        setTracking(true);
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const newPos = [pos.coords.latitude, pos.coords.longitude];
            setPosition(newPos);
            onPositionChange(newPos); // Update parent component with position
            console.log(newPos);
            map.flyTo(newPos, 16); // Center map on user location
          },
          (err) => console.error("Error getting location:", err),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      }
    };
  
    useEffect(() => {
      return () => {
        if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
      };
    }, []);
  
    return (
      <>
        {!tracking && (
          <button 
            onClick={startTracking} 
            style={{ 
              position: "absolute", 
              top: "10px", 
              left: "10px", 
              zIndex: 1000,
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Enable Location
          </button>
        )}
        {position && (
          <Marker position={position} icon={userIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
      </>
    );
}

function DustbinMarkers({ userPosition, onRouteChange }) {
    const [dustbins] = useState(dusbinData);
    const map = useMap();
    
    // Function to get route to a dustbin
    const getRoute = async (binLocation) => {
      if (!userPosition) {
        alert("Please enable location tracking first");
        return;
      }
      
      try {
        // Use OSRM routing service to get the shortest path
        const apiUrl = `https://router.project-osrm.org/route/v1/driving/${userPosition[1]},${userPosition[0]};${binLocation.longitude},${binLocation.latitude}?overview=full&geometries=geojson`;
        const response = await axios.get(apiUrl);
        
        // Extract route coordinates and convert from [lng, lat] to [lat, lng] format for Leaflet
        const routeCoordinates = response.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        // Update the route in parent component
        onRouteChange(routeCoordinates);
        
        // Adjust map view to show the entire route
        const bounds = L.latLngBounds([userPosition, [binLocation.latitude, binLocation.longitude]]);
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (error) {
        console.error("Error fetching route:", error);
        alert("Failed to fetch route. Please try again.");
      }
    };
    
    return (
      <>
        {dustbins.map(bin => (
          <Marker
            key={bin.id} 
            position={[bin.locn.latitude, bin.locn.longitude]}
            icon={icons[bin.status]}
            eventHandlers={{
              click: () => getRoute(bin.locn)
            }}
          >
            {/**pop up information: id, status, last_emptied at */}
            <Popup>
              <b>Bin #{bin.id}</b><br />
              Status: {bin.status.replace('_', ' ')}<br />
              Updated: {new Date(bin.lastEmptiedAt).toLocaleTimeString()}
              <br />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  getRoute(bin.locn);
                }}
                style={{
                  marginTop: "8px",
                  padding: "4px 8px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Get Route
              </button>
            </Popup>
          </Marker>
        ))}
      </>
    );
}

function Map() {
    const defaultPosition = [18.5532, 73.8426]; // default (coep hostel)
    const [userPosition, setUserPosition] = useState(null);
    const [route, setRoute] = useState([]);
   
    return (
        <div>
            <MapContainer center={defaultPosition} zoom={13} style={{ height: '100vh', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <UserLocation onPositionChange={setUserPosition} />
                <DustbinMarkers userPosition={userPosition} onRouteChange={setRoute} />
                
                {/* Display route as a blue polyline when available */}
                {route.length > 0 && (
                    <Polyline 
                        positions={route} 
                        color="#0078FF" 
                        weight={5} 
                        opacity={0.7} 
                    />
                )}
            </MapContainer>
        </div>
    );
}

export default Map;