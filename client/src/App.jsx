import './App.css';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import {createBrowserRouter, RouterProvider } from "react-router-dom"
import Main from './pages/UserMain';
import Schedule from './pages/Schedule';
import Login from "./components/login"
import AdminDashboard from './pages/adminDashboard';
import UserDashboard from './pages/userDashboard';
import UserMainNavigation from './components/userMainNavigation';
import AdminMainNavigation from './components/adminMainNavigation';
import UserReport from './pages/userReport';
import WCReports from './pages/WCReports';
// const App = () => {
//   return (
//     <Router>
//       <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/adminDashboard" element={<AdminDashboard />} />
//         <Route path="/userDashboard" element={<UserDashboard />} />
//         <Route path="/" element={<Main />}></Route>
//          <Route path="/schedule" element={<Schedule />}></Route>
//       </Routes>
//     </Router>
//   )
// }

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/wc-dashboard",
    
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
        path: "userReport", // Relative path
        element: <UserReport />,
      },
    ],
  },
  {
    path: "/wc-dashboard",
    element: <Schedule />,
    children: [
      {
        path: "", // Default child route (relative path)
        element: <Main />,
      },
      {
        path: "userReport", // Relative path
        element: <Schedule />,
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
  return(
    <>
    <RouterProvider router = {router}></RouterProvider>
    </>
  );
}

export default App;

