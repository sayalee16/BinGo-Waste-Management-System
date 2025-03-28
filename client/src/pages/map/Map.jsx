import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import dusbinData from "./../../../../data/dusbin_information_areas.json"


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

function DustbinMarkers() {
    const [dustbins, setDustbins] = useState(dusbinData);
  
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

function Map(){

    const position=[18.5532, 73.8426]; // default (coep hostel)
   

    return (
        <div>
            <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <DustbinMarkers/>
            </MapContainer>

        </div>
    )
}

export default Map;