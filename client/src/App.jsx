import './App.css';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import {createBrowserRouter, RouterProvider } from "react-router-dom"
import Main from './pages/UserMain';
import Schedule from './pages/Schedule';
import Login from "./components/login"
import AdminDashboard from './pages/adminDashboard';
// import UserDashboard from './pages/userDashboard';
import UserMainNavigation from './components/userMainNavigation';
import AdminMainNavigation from './components/AdminMainNavigation';
import UserReportForm from './pages/userReportForm';
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
    element: <Login/>,
  },
  {
    path : "/userMainNavigation", 
    element: <UserMainNavigation/>,
    children:[
      {
        path:"/userMainNavigation",
         element:<Main/>
      },
      {
        path : "userReport", 
        element: <UserReportForm/>,
        
      }
    ]
  },
  {
    path: "/adminMainNavigation",
    element: <AdminMainNavigation/>,
    children:[
      {
        path : "adminDashboard",  
        element: <AdminDashboard/>,
      }
    ]

  }
  
])


const App = () => {
  return(
    <>
    <RouterProvider router = {router}></RouterProvider>
    </>
  );
}

export default App;

