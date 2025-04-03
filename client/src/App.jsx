import './App.css';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Main from './pages/UserMain';
import Schedule from './pages/Schedule';
import Login from "./components/login";
import AdminDashboard from './pages/adminDashboard';
import UserMainNavigation from './components/userMainNavigation';
import WCReports from './pages/WCReports';
import AdminMainNavigation from './components/AdminMainNavigation';
import UserReportForm from './pages/userReportForm';

// Layout component for Waste Collector Dashboard
const WasteCollectorLayout = () => {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold py-4">Waste Collector Dashboard</h1>
      <Outlet /> {/* Renders child routes */}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/wc-dashboard",
    element: <WasteCollectorLayout />, // Parent component for Waste Collector Dashboard
    children: [
      {
        path: "wc-reports", // Relative path for reports
        element: <WCReports />,
      },
      {
        path: "schedule", // Relative path for schedule
        element: <Schedule />,
      },
    ],
  },
  {
    path: "/userMainNavigation",
    element: <UserMainNavigation />,
    children: [
      {
        path: "", // Default child route (relative path)
        element: <Main />,
      },
      {
        path: "userReportForm", // Relative path for UserReportForm
        element: <UserReportForm />,
      },
    ],
  },
  {
    path: "/adminMainNavigation",
    element: <AdminMainNavigation />,
    children: [
      {
        path: "adminDashboard", // Relative path
        element: <AdminDashboard />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
};

export default App;