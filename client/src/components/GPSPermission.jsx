import { useState } from "react";

const GetUserLocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setError(""); // Clear any previous errors
            },
            (err) => {
                // setError("Permission denied or error getting location.");
                // console.error("Error getting location:", err);
            }
        );
    };

    return (
        <div className="p-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={getLocation}>
                Get My Location 📍
            </button>

            {location && (
                <p className="mt-3 text-gray-700">
                    📍 Latitude: {location.latitude}, Longitude: {location.longitude}
                </p>
            )}

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default GetUserLocation;
