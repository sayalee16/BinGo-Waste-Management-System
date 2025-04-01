import './App.css';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router"
import Main from './pages/UserMain';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App;
