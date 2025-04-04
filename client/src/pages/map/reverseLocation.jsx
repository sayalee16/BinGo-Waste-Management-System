export default async function reverseLocation(locations) {
    const areaPromises = locations.map(async (location) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lon}&format=json`);
        const data = await response.json();
        return data.address.suburb || data.address.city_district || data.address.town || data.address.village || "Unknown Area";
    });

    return await Promise.all(areaPromises);
}