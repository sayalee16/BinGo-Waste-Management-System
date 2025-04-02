import './App.css';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router"
import Main from './pages/UserMain';
import Schedule from './pages/Schedule';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/schedule" element={<Schedule />}></Route>
      </Routes>
    </Router>
  )
}

export default App
