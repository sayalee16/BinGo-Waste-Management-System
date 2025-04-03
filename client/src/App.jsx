import './App.css';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from './pages/UserMain';
import Schedule from './pages/Schedule';
import Login from "./components/login";
import AdminDashboard from './pages/adminDashboard';
import UserMainNavigation from './components/userMainNavigation';
import WCReports from './pages/WCReports';
import AdminMainNavigation from './components/adminMainNavigation';
import UserReportForm from './pages/userReportForm';
import CollectorMap from './pages/map/CollectorMap';

const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/wc-dashboard" element={<Schedule />} />
        <Route path="/wc-reports" element={<WCReports />} />
        <Route path="/schedule" element={<Schedule />} />

        <Route path="/userMainNavigation" element={<UserMainNavigation />} />
        <Route path="/main" element={<Main />} />
        <Route path="/userReportForm" element={<UserReportForm />} />

        <Route path="/adminMainNavigation" element={<AdminMainNavigation />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />

        <Route path="/wcRoute" element={<CollectorMap/>}/>
      </Routes>
    </Router>
  );
};

export default App;