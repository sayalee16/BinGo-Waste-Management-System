import {MapContainer, TileLayer, Marker, Popup, useMap, Polyline} from "react-leaflet";
import L from "leaflet";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import WCNavbar from "../../components/WCNavbar";

// Icons for different types of waste points
const icons = {
  // Bin status icons
  recycled: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
  }),
  partially_filled: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
  }),
  filled: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
  }),
  // Open area waste icon
  open_area: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
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
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 via-emerald-500 to-lime-500 text-white text-sm sm:text-base px-6 py-3 rounded-2xl font-semibold shadow-md hover:scale-105 active:scale-95 transition-all duration-200 border-amber-50 border-2 z-[1000]"
        
      >
        Begin  Collection
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
            key={point.id || waste-`${index}`} 
            position={location}
            icon={icons[iconType]}
          >
            <Popup>
              <strong>{point.isBin ? "Waste Bin" : "Open Area Waste"}</strong><br />
              ID: {point.id}<br />
              {point.lastUpdated && <div>Updated: {new Date(point.lastUpdated).toLocaleString()}<br /></div>}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

function CollectorMap() {
  const LOCATION = [18.4862, 73.8164]//[18.497536, 73.793536];
  const RADIUS = 6000;

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

      setWastePoints(wastePointsWithinRadius);
      setLoading(false);

      } catch (err) {
        console.error("Error fetching waste points:", err);
        setError("No waste collection points");
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
      if (!collectorPosition || activeWastePoints.length === 0) {
        return};
      
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
        console.error("No collection route:", error);
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
    
    fetch (`${import.meta.env.VITE_BACKEND_URL}/api/userreport/change-reports`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wc_status: "recycled",
      }),
      }
    )
  

    await Promise.all(updatePromises);
    // await Promise.all(reportUpdatePromises);
    setRoute([]); // Clear the route
    } catch (err) {
      console.error("Error marking waste point as completed:", err);
      alert("Failed to update status. Please try again.");
      
      // For testing - still update UI
      setCompletedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="collector-map-container relative h-screen w-full flex flex-col overflow-hidden">
    {/* Motivational Heading */}
    {/* <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-green-700 text-center p-2 sm:p-6 md:p-4 lg:p-4 z-[2000]">
      Greetings ! <br />
      One route, one mission — a cleaner world in every bin! 🌍🍃
    </h1> */}
    <WCNavbar/>

    {/* Loading & Error States */}
    {loading && (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white p-5 rounded-lg shadow-lg">
        Loading waste collection points...
      </div>
    )}

    {error && (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white p-5 rounded-lg shadow-lg text-red-600">
        {error}
      </div>
    )}

    {/* Map Container */}
    <div className="relative flex-1">
      <MapContainer
        center={defaultPosition}
        zoom={14}
        className="h-full w-full z-0"
      >
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

        {/* Route */}
        {route.length > 0 && (
          <Polyline
            positions={route}
            color="#0078FF"
            weight={5}
            opacity={0.7}
          />
        )}
      </MapContainer>

      {/* Floating Centered Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
        <button
          onClick={handleMarkComplete}
          className="bg-gradient-to-r from-rose-500 to-orange-400 text-white text-sm sm:text-base px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Done with the collections!
        </button>
      </div>
    </div>
  </div>
  );
}

export default CollectorMap;