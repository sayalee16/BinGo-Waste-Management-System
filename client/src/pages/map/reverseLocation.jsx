export default reverseLocation({ loctions }){
    const area = getMainArea(location.lat, location.lon) {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lon}&format=json`)
        .then(response => response.json())
        .then(data => {
            let area = data.address.suburb || data.address.city_district || data.address.town || data.address.village || "Unknown Area";
            console.log("Main Area:", area);
            document.getElementById("area").innerText = area;
        })
        .catch(error => console.error("Error fetching address:", error));
    }

    return(
    
    )
}