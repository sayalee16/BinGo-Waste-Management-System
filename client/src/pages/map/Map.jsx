import {MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";
import L from "leaflet";
import { useState , useRef, useEffect} from "react";
import dusbinData from "./../../../../data/waste_bin_data.json"

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
})

function DustbinMarkers() {
    const [dustbins] = useState(dusbinData);

    return (
      <>
        {dustbins.map(bin => (
          <Marker
            key={bin.id} 
            position={[bin.locn.latitude, bin.locn.longitude]}
            icon={icons[bin.status]}
          >
            {/**pop up information: id, status, last_emptied at */}
            <Popup>
              <b>Bin #{bin.id}</b><br />
              Status: {bin.status.replace('_', ' ')}<br />
              Updated: {new Date(bin.lastEmptiedAt).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </>
    );
}

function UserLocation() {
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

function Map(){

    const position=[18.5532, 73.8426]; // default (coep hostel)
   

    return (
        <div>
            <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <UserLocation/>
            <DustbinMarkers/>
            </MapContainer>

        </div>
    )
}

export default Map;