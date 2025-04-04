import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from "react-leaflet";
import L from "leaflet";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserReportForm from "../userReportForm";

const LOCATION = []
// Dustbin icons
const icons = {
  recycled: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
  }),  
  empty: L.icon({
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

// Fallback icon for unexpected statuses
const defaultIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  iconSize: [25, 41],
});

// Custom user location icon
const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [25, 41],
});

// Environmental impact messages
const environmentalMessages = [
  "Walking to this bin saves 0.2kg of CO2 compared to driving!",
  "Using this bin properly reduces landfill waste by up to 80%",
  "Recycling one aluminum can saves enough energy to run a TV for 3 hours",
  "By sorting your waste, you help conserve natural resources for future generations",
  "Your small action today creates a big impact tomorrow!"
];

// App intro popup component
function IntroPopup({ setShowIntro }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1001] bg-black bg-opacity-15 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-green-600 mb-6 tracking-wide">
  Welcome to <span className="text-green-700 italic">BinGO!</span>
</h2>
        <div className="flex justify-center space-x-4 text-4xl mb-4">
          <span>♻️</span>
          <span>🗑️</span>
          <span>🌍</span>
        </div>

        <p className="text-gray-600 text-base mb-2">
  Ready to explore? Find bins nearby — fast and easy!
</p>
<p className="text-gray-600 text-base  mb-6">
Small steps, big change.
</p>
        <button
  onClick={() => setShowIntro(false)}
  className="relative px-8 py-3 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden group"
>
  <span className="absolute inset-0 bg-white opacity-10 blur-md group-hover:opacity-20 transition-all duration-300"></span>
  <span className="relative z-10">🌟 Get Started 🌿</span>
</button>

      </div>
    </div>
  );
}

function UserLocation({ onPositionChange }) {
  const [position, setPosition] = useState(null);
  const [tracking, setTracking] = useState(false);
  const map = useMap();
  const watchIdRef = useRef(null);

  useEffect(() => {
    navigator.permissions && navigator.permissions.query({ name: 'geolocation' })
      .then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          startTracking();
        }

        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            startTracking();
          }
        };
      })
      .catch(err => {
        console.error("Permission API error:", err);
      });
  }, []);

  const startTracking = () => {
    if (navigator.geolocation) {
      setTracking(true);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          onPositionChange(newPos);
          map.flyTo(newPos, 16);
        },
        (err) => {
          console.error("Error getting location:", err);
          if (err.code === 1) {
            setTracking(false);
          }
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
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
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}
        >
          <span style={{ marginRight: "5px" }}>📍</span> Enable Location
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

const NearbyBinsPanel = ({ nearbyBins, getRoute }) => {
  // Array of catchy phrases
  const distancePhrases = [
    "Just a hop, skip, and jump away!",
    "Not too far, just a little more to go!",
    "It's almost within your reach!",
    "You're so close, keep going!",
    "The bin is calling your name!",
    "Bin’s waiting for you, just a few steps away!",
    "Only a few meters stand between you and the bin!"
  ];

  return (
    <div className="fixed top-16 left-0 h-full w-[300px] bg-white shadow-lg z-[1000] p-4 overflow-y-auto border-r border-green-100">
      <h3 className="text-xl font-bold text-green-600 mb-5 flex items-center">
        <span className="mr-2 text-2xl">♻️</span> Nearby Bins
        <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          {nearbyBins.length}
        </span>
      </h3>

      {nearbyBins
        .filter(bin => ['recycled', 'empty', 'partially_filled'].includes(bin.status))
        .map(bin => (
          <div
            key={bin.id}
            onClick={() => getRoute(bin)}
            className="bg-green-50 p-5 rounded-lg mb-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
            <div className="font-semibold text-gray-800">
              <span className="text-lg">
                {distancePhrases[Math.floor(Math.random() * distancePhrases.length)]} 
                <span className="text-sm text-gray-500 ml-2">
                {Math.round(bin.distance / 1000)} km
                </span>
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Status:{' '}
              <span
                className={`font-semibold ${
                  bin.status === 'recycled'
                    ? 'text-green-600'
                    : bin.status === 'partially_filled'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {bin.status.replace('_', ' ')}
              </span>
            </div>
            <button className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition ease-in-out transform hover:scale-105">
              Show Route
            </button>
          </div>
        ))}
    </div>
  );
};
function EnvironmentalImpactPopup({ message, onClose }) {
  return (
    <div className="fixed top-20 right-8 bg-white bg-opacity-90 px-6 py-4 rounded-lg shadow-lg z-[1050] flex items-start space-x-4 text-sm max-w-sm">
      <span className="text-2xl mt-1">🌱</span>
      <div className="flex-1">
        <p className="font-semibold text-green-700 text-base mb-1">Environmental Impact</p>
        <p className="text-gray-700 leading-snug">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 text-lg mt-1"
      >
        ✖️
      </button>
    </div>
  );
}



function DustbinMarkers({ userPosition, onRouteChange, setNearbyBins, highlightBin }) {
  const [dustbins, setDustbins] = useState([]);
  const map = useMap();

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  // Fetch wastebin data from the backend
  useEffect(() => {
    const fetchDustbins = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wastebin/wastebins`);
        const data = await response.json();

        // Process the fetched data
        const processedDustbins = data.map(bin => ({
          id: bin.id,
          location: bin.locn,
          status: bin.status,
          lastEmptiedAt: bin.lastEmptiedAt,
          realTimeCapacity: bin.realTimeCapacity,
          totalCapacity: bin.totalCapacity,
          category: bin.category,
        }));

        setDustbins(processedDustbins);
      } catch (error) {
        console.error("Error fetching dustbins:", error);
      }
    };

    fetchDustbins();
  }, []);

  // Filter nearby bins based on user position
  useEffect(() => {
    if (userPosition) {
      const nearby = dustbins
        .map(bin => ({
          ...bin,
          distance: calculateDistance(
            userPosition[0], userPosition[1],
            bin.location.latitude, bin.location.longitude
          ),
        }))
         // Filter bins within 30km
        .filter(bin => bin.distance <= 200)
        .sort((a, b) => a.distance - b.distance);

      setNearbyBins(nearby);
    }
  }, [userPosition, dustbins, setNearbyBins]);

  const getRoute = async (binLocation) => {
    if (!userPosition) {
      alert("Please enable location tracking first");
      return;
    }

    try {
      const apiUrl = `https://router.project-osrm.org/route/v1/driving/${userPosition[1]},${userPosition[0]};${binLocation.longitude},${binLocation.latitude}?overview=full&geometries=geojson`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.routes && response.data.routes.length > 0) {
        const routeCoordinates = response.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        const envMessage = environmentalMessages[Math.floor(Math.random() * environmentalMessages.length)];
        onRouteChange(routeCoordinates, envMessage);

        const bounds = L.latLngBounds([userPosition, [binLocation.latitude, binLocation.longitude]]);
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        throw new Error("No routes found.");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      alert("Failed to fetch route. Please try again.");
    }
  };

  useEffect(() => {
    if (highlightBin && highlightBin.location) {
      map.flyTo([highlightBin.location.latitude, highlightBin.location.longitude], 18);
      getRoute(highlightBin.location);
    }
  }, [highlightBin]);

  return (
    <>
      {dustbins.map(bin => {
        const isHighlighted = highlightBin && highlightBin.id === bin.id;
        const icon = icons[bin.status] || defaultIcon;

        return (
          <Marker
            key={bin.id}
            position={[bin.location.latitude, bin.location.longitude]}
            icon={isHighlighted ? L.icon({ ...icon.options, iconSize: [30, 49] }) : icon}
            eventHandlers={{
              click: () => getRoute(bin.location),
            }}
          >
            <Popup>
              <b>Bin #{bin.id}</b><br />
              Status: {bin.status.replace('_', ' ')}<br />
              Capacity: {bin.realTimeCapacity}/{bin.totalCapacity}<br />
              Category: {bin.category}<br />
              Last Emptied: {new Date(bin.lastEmptiedAt).toLocaleString()}
              <br />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  getRoute(bin.location);
                }}
                style={{
                  marginTop: "8px",
                  padding: "4px 8px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Get Route
              </button>
            </Popup>
          </Marker>
        );
      })}

      {userPosition && (
        <Circle
          center={userPosition}
          radius={300}
          pathOptions={{ color: '#4CAF50', fillColor: '#4CAF5033', weight: 1 }}
        />
      )}
    </>
  );
}

function Map() {
  const defaultPosition = [18.5532, 73.8426];
  const [userPosition, setUserPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [environmentalMessage, setEnvironmentalMessage] = useState("");
  const [nearbyBins, setNearbyBins] = useState([]);
  const [highlightBin, setHighlightBin] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const navigate = useNavigate();

  const handleRouteChange = (routeCoordinates, envMessage) => {
    setRoute(routeCoordinates);
    setEnvironmentalMessage(envMessage);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        setRoute([]);
        setEnvironmentalMessage("");
        setHighlightBin(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleShowBin = (bin) => {
    setHighlightBin(bin);
  };

  return (
    <div className="z--1" style={{ position: 'relative' }}>
      {showIntro && <IntroPopup setShowIntro={setShowIntro} />}

      <MapContainer center={defaultPosition} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <UserLocation onPositionChange={setUserPosition} />
        <DustbinMarkers
          userPosition={userPosition}
          onRouteChange={handleRouteChange}
          setNearbyBins={setNearbyBins}
          highlightBin={highlightBin}
        />

        {route.length > 0 && (
          <Polyline
            positions={route}
            color="#0078FF"
            weight={5}
            opacity={0.7}
          />
        )}
      </MapContainer>

      <NearbyBinsPanel
        userPosition={userPosition}
        nearbyBins={nearbyBins}
        getRoute={(bin) => handleShowBin(bin)}
      />
        {/**REPORT button */}
        <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          className="bg-green-500 text-white p-3 rounded shadow-lg"
          onClick={() => navigate("/userReportForm")}
        >
          Report
        </button>
      </div>

      {environmentalMessage && (
        <EnvironmentalImpactPopup
          message={environmentalMessage}
          onClose={() => {
            setEnvironmentalMessage("");
          }}
        />
      )}

      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '0.9em',
        zIndex: 999
      }}>
        Press <b>ESC</b> or <b>Backspace</b> to clear route
      </div>
    </div>
  );
}

export default Map;