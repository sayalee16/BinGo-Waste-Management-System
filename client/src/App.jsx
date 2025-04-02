import './App.css';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router"
import UserMain from './pages/UserMain';
import Login from "./components/login"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserMain />}></Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App;
