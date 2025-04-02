import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
// import './userMainNavigation.css';
import Navbar from './Navbar';
import Footer from './Footer';

const UserMainNavigation = () => {
    return(
        <>
        <Navbar/>
        <Outlet/>
        <Footer/>
        </>
    );
};

export default UserMainNavigation;