import io from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";

const socket = io("http://localhost:5000");

function Notifications() {
  const [dustbins, setDustbins] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/dustbins").then(res => setDustbins(res.data));
    socket.on("dustbinUpdate", updatedBins => setDustbins(updatedBins));
    
    return () => socket.off("dustbinUpdate");
  }, []);

  return dustbins;
}

export default Notifications;
