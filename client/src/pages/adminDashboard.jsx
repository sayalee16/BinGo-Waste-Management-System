// adminDashboard.js - Client-side code for admin dashboard

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:8800'); // Replace with your server URL

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    // Socket connection status
    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to notification server');
    });
    
    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from notification server');
    });

    // Listen for bin alerts
    socket.on('binAlert', (alert) => {
      console.log('Received bin alert:', alert);
      
      // Add to notifications list
      setNotifications(prev => [alert, ...prev]);
      
      // Show toast notification with different styling based on alert type
      const toastOptions = {
        position: "top-right",
        autoClose: 10000, // 10 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      };
      
      if (alert.alertType === "FULLY FILLED") {
        toast.error(alert.message, toastOptions);
        // You could also play a sound here
        playAlertSound('critical');
      } else {
        toast.warning(alert.message, toastOptions);
        playAlertSound('warning');
      }
    });
    
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('binAlert');
    };
  }, []);
  
  // Function to play alert sounds
  const playAlertSound = (type) => {
    const sound = new Audio();
    sound.src = type === 'critical' ? '/sounds/critical-alert.mp3' : '/sounds/warning-alert.mp3';
    sound.play().catch(err => console.error('Error playing sound:', err));
  };
  
  const API_BASE_URL = "http://localhost:8800/api/wastebin";
  // For testing - simulate bin capacity change
  const simulateBinUpdate = async (binId, capacity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/simulate-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ binId, newCapacity: capacity })
      });
      
      const data = await response.json();
      console.log('Simulation result:', data);
    } catch (error) {
      console.error('Error simulating bin update:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <ToastContainer />
      
      <div className="connection-status">
        Status: {connected ? 
          <span className="status-connected">Connected</span> : 
          <span className="status-disconnected">Disconnected</span>}
      </div>
      
      <h2>Recent Notifications</h2>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p>No notifications yet</p>
        ) : (
          notifications.map((alert, index) => (
            <div 
              key={index} 
              className={`notification-item ${
                alert.alertType === "FULLY FILLED" ? "critical" : "warning"
              }`}
            >
              <div className="notification-header">
                <span className="bin-id">Bin ID: {alert.id}</span>
                <span className="timestamp">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="notification-body">
                <p>{alert.message}</p>
                <div className="capacity-bar">
                  <div 
                    className="capacity-fill" 
                    style={{width: `${alert.realTimeCapacity}%`}}
                  ></div>
                </div>
                <div className="alert-details">
                  <span>Ward: {alert.ward}</span>
                  <span>Zone: {alert.zone}</span>
                  <span>Capacity: {alert.realTimeCapacity}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Test controls - remove in production */}
      <div className="test-controls">
        <h3>Test Bin Updates</h3>
        <button onClick={() => simulateBinUpdate('67ede138cd0a038db4d9b8a8', 55)}>
          Simulate 55% Capacity
        </button>
        <button onClick={() => simulateBinUpdate('67ede138cd0a038db4d9b8ae', 90)}>
          Simulate 90% Capacity
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;