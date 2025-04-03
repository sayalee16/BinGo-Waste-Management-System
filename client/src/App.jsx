import './App.css';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from './pages/UserMain';
import Schedule from './pages/Schedule';
import Login from "./components/login";
import AdminDashboard from './pages/adminDashboard';
import UserMainNavigation from './components/userMainNavigation';
//import WCReports from './pages/WCReports';
import AdminMainNavigation from './components/AdminMainNavigation';
import UserReportForm from './pages/userReportForm';
//import WasteCollectorLayout from './components/WasteCollectorLayout'; // Assuming this is a separate file
import Complaints from './pages/complaints';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Waste Collector Dashboard */}
        {/* <Route path="/wc-dashboard" element={<WasteCollectorLayout />} />
        <Route path="/wc-reports" element={<WCReports />} />
        <Route path="/schedule" element={<Schedule />} /> */}

        {/* User Main Navigation */}
        <Route path="/userMainNavigation" element={<UserMainNavigation />} />
        <Route path="/main" element={<Main />} />
        <Route path="/userReportForm" element={<UserReportForm />} />
        <Route path="/complaints" element={<Complaints />} />  

        {/* Admin Main Navigation */}
        <Route path="/adminMainNavigation" element={<AdminMainNavigation />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;