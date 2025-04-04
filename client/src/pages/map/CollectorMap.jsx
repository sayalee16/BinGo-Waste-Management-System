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



function WastePointsLayer({ points, collectorPosition }) {
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
              {point.lastUpdated && <div>Updated: {new Date(point.lastUpdated).toLocaleString()}<br /></div>}
              <button 
                onClick={() => onMarkComplete(point.id)}
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Mark as Completed
              </button>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

function CollectorMap() {
  const LOCATION = [18.497536, 73.793536];
  const RADIUS = 10000;

  const defaultPosition = [18.5532, 73.8426]; // default position
  const [collectorPosition, setCollectorPosition] = useState(null);
  const [wastePoints, setWastePoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [route, setRoute] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);

    function getDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3; // Earth radius in meters
      const C1 = lat1 * (Math.PI / 180);
      const C2 = lat2 * (Math.PI / 180);
      const C3 = (lat2 - lat1) * (Math.PI / 180);
      const C4 = (lon2 - lon1) * (Math.PI / 180);

      const a = Math.sin(C3 / 2) * Math.sin(C3 / 2) +
                Math.cos(C1) * Math.cos(C2) *
                Math.sin(C4 / 2) * Math.sin(C4 / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in meters
  }

  // Fetch waste points from backend
  useEffect(() => {
    const fetchWastePoints = async () => {
      // Fetch reports data
      try {
      const reportsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userreport/reports`);
      const reportsData = reportsResponse.data;

      // Fetch wastebins data
      const wastebinsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wastebin/wastebins-filtered`);

      const wastebinsData = await wastebinsResponse.json();
      console.log("Fetched Data:", wastebinsData); // Debugging

      // Ensure it's an array
    const wastebinArray = Array.isArray(wastebinsData) ? wastebinsData : [wastebinsData];

    // Filter wastebins
    const filteredWastebins = wastebinArray.filter(bin => 
        bin.status === "partially_filled" || bin.status === "filled"
    );
    console.log("Filtered Wastebins:", filteredWastebins);

    // Convert wastebin data to match report format
    const formattedWastebins = filteredWastebins.map(bin => ({
        id: bin._id,
        location: {
            latitude: bin.locn?.latitude, // Use optional chaining
            longitude: bin.locn?.longitude,
        },
        status: bin.status,
        isBin: true, // Mark it as a bin
    }));

    console.log("Formatted Wastebins:", formattedWastebins);

     const wastePointsWithinRadius = formattedWastebins.filter(point => {
       if (!point.location.latitude || !point.location.longitude) return false;
       const distance = getDistance(LOCATION[0], LOCATION[1], point.location.latitude, point.location.longitude);
       return distance <= RADIUS;
   });

   console.log("Waste Points within RADIUS:", wastePointsWithinRadius);

      setWastePoints(formattedWastebins);
      setLoading(false);

      } catch (err) {
        console.error("Error fetching waste points:", err);
        setError("Failed to load waste collection points");
        setLoading(false);
      }
    };

    fetchWastePoints();
  }, []);

  // Filter out completed waste points
  const activeWastePoints = wastePoints.filter(point => !completedIds.includes(point.id));

  // Create optimized route when collector position or waste points change
  useEffect(() => {
    const createOptimizedRoute = async () => {
      if (!collectorPosition || activeWastePoints.length === 0) return;
      
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
  }, [collectorPosition, activeWastePoints]);

  //Handle marking a waste point as completed
  const handleMarkComplete = async (id) => {
      try {
        const isoDateString = new Date().toISOString();

        const updatePromises = activeWastePoints.map((point) =>
      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/wastebin/update-wastebin/${point.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lastEmptiedAt: isoDateString,
            status: "empty",
            realTimeCapacity: 0,
          }),
        }
      )
    );

    await Promise.all(updatePromises);
    setRoute([]); // Clear the route
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
          A clean city is a happy city. Every bin you empty makes the world a little better!
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
          points={activeWastePoints} 
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
      <button onClick={handleMarkComplete}>
  Done with the task!
</button>
      {/* Progress indicator */}
    </div>
  );
}

export default CollectorMap;