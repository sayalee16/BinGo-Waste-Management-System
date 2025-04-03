import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8800"); // Adjust URL for deployment

const useSocket = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket.on("binAlert", (alert) => {
      setAlerts((prevAlerts) => [...prevAlerts, alert]);
    });

    return () => socket.off("binAlert");
  }, []);

  return alerts;
};

export default useSocket;
