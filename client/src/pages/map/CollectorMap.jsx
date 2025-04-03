import {MapContainer, TileLayer, Marker, Popup, useMap, Polyline} from "react-leaflet";
import L from "leaflet";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

// Icons for different types of waste points
const icons = {
  // Bin status icons
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
  // Open area waste icon
  open_area: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    iconSize: [25, 41],
  }),
};

// Custom collector location icon
const collectorIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [25, 41],
});

function CollectorLocation({ onPositionChange }) {
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
          map.flyTo(newPos, 16); // Center map on collector location
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
          Start Collection Route
        </button>
      )}
      {position && (
        <Marker position={position} icon={collectorIcon}>
          <Popup>Your current location</Popup>
        </Marker>
      )}
    </>
  );
}



function WastePointsLayer({ points, collectorPosition , onMarkComplete }) {
  const map = useMap();
  
  return (
    <>
      {points.map((point, index) => {
        const location = [point.location.latitude, point.location.longitude];
        const iconType = point.isBin ? (point.status || "filled") : "open_area";
        
        return (
          <Marker
            key={point.id || `waste-${index}`} 
            position={location}
            icon={icons[iconType]}
          >
            <Popup>
              <strong>{point.isBin ? "Waste Bin" : "Open Area Waste"}</strong><br />
              ID: {point.id}<br />
              {point.description && <div>Description: {point.description}<br /></div>}
              {point.lastUpdated && <div>Updated: {new Date(point.lastUpdated).toLocaleString()}<br /></div>}
               
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

function CollectorMap() {
      
  const defaultPosition = [18.5532, 73.8426]; // default position
  const [collectorPosition, setCollectorPosition] = useState(null);
  const [wastePoints, setWastePoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [route, setRoute] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);

  // Fetch waste points from backend
  useEffect(() => {
    const fetchWastePoints = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userreport/reports`);
        setWastePoints(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching waste points:", err);
        setError("Failed to load waste collection points");
        setLoading(false);
        
        // For testing - mock data
        setWastePoints([
          {
            id: "bin1",
            isBin: true,
            status: "filled",
            location: { latitude: 18.553, longitude: 73.844 },
            lastUpdated: new Date().toISOString()
          },
          {
            id: "bin2",
            isBin: true,
            status: "partially_filled",
            location: { latitude: 18.556, longitude: 73.840 },
            lastUpdated: new Date().toISOString()
          },
          {
            id: "area1",
            isBin: false,
            location: { latitude: 18.550, longitude: 73.838 },
            description: "Trash pile near park entrance",
            lastUpdated: new Date().toISOString()
          }
        ]);
      }
    };

    fetchWastePoints();
  }, []);

  // Filter out completed waste points
  const activeWastePoints = wastePoints.filter(point => !completedIds.includes(point.id));

  // Create optimized route when collector position or waste points change
  useEffect(() => {
    const createOptimizedRoute = async () => {
      if (!collectorPosition || kothrudWastePoints.length === 0) return;
      
      try {
        // Start with collector position
        let coordinates = `${collectorPosition[1]},${collectorPosition[0]}`;
        
        // Add all waste points
        activeWastePoints.forEach(point => {
          coordinates += `;${point.location.longitude},${point.location.latitude}`;
        });

        // Use OSRM trip service to create an optimized route that visits all points
        const apiUrl = `https://router.project-osrm.org/trip/v1/driving/${coordinates}?overview=full&geometries=geojson&roundtrip=true`;
        const response = await axios.get(apiUrl);
        
        // Extract route coordinates and convert from [lng, lat] to [lat, lng] format for Leaflet
        const routeCoordinates = response.data.trips[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        // Update the route
        setRoute(routeCoordinates);
      } catch (error) {
        console.error("Error creating collection route:", error);
      }
    };

    createOptimizedRoute();
  }, [collectorPosition, kothrudWastePoints]);

  //Handle marking a waste point as completed
  const handleMarkComplete = async (id) => {
    try {
      // Send completion status to backend
      await axios.post(`/api/waste-points/${id}/complete`, {
        collectorId: "current-collector-id", // Replace with actual collector ID
        completedAt: new Date().toISOString()
      });
      
      // Update local state
      setCompletedIds(prev => [...prev, id]);
      
      // Show success message
      alert(`Waste point #${id} marked as collected`);
    } catch (err) {
      console.error("Error marking waste point as completed:", err);
      alert("Failed to update status. Please try again.");
      
      // For testing - still update UI
      setCompletedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="collector-map-container">
      {loading && (
        <div style={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
        }}>
          Loading waste collection points...
        </div>
      )}
      
      {error && (
        <div style={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          color: "red"
        }}>
          {error}
        </div>
      )}
      
      <MapContainer center={defaultPosition} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <CollectorLocation onPositionChange={setCollectorPosition} />
        <WastePointsLayer 
          points={kothrudWastePoints} 
          collectorPosition={collectorPosition}
           onMarkComplete={handleMarkComplete}
        />
        
        {/* Display optimized route as a blue polyline when available */}
        {route.length > 0 && (
          <Polyline 
            positions={route} 
            color="#0078FF" 
            weight={5} 
            opacity={0.7} 
          />
        )}
      </MapContainer>
      
      {/* Progress indicator */}
      <div style={{ 
        position: "absolute", 
        bottom: "20px", 
        right: "20px", 
        zIndex: 1000,
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        minWidth: "200px"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>Collection Progress</h3>
        <div>
          <strong>Completed:</strong> {completedIds.length} / {wastePoints.length}
        </div>
        <div style={{ 
          backgroundColor: "#eee", 
          height: "10px", 
          borderRadius: "5px",
          marginTop: "8px" 
        }}>
          <div style={{ 
            backgroundColor: "#4CAF50",
            width: `${wastePoints.length > 0 ? (completedIds.length / wastePoints.length) * 100 : 0}%`,
            height: "100%",
            borderRadius: "5px"
          }}></div>
        </div>
        <div style={{ marginTop: "10px", fontSize: "12px" }}>
          {activeWastePoints.length > 0 ? 
            `${activeWastePoints.length} waste points remaining` : 
            "All waste points collected!"
          }
        </div>
      </div>
    </div>
  );
}

export default CollectorMap;