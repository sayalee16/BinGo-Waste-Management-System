import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
// import './userMainNavigation.css';
import Navbar from './Navbar';
import Footer from './Footer';
import SlideUpPanel from './SlideUpPanel';

const UserMainNavigation = () => {
    return(
        <>
        <Navbar/>
        <Outlet/>
        <SlideUpPanel/>
        <Footer/>
        </>
    );
};

export default UserMainNavigation;