import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
// import './userMainNavigation.css';
import Navbar from './Navbar';
import Footer from './Footer';
import Map from '../pages/map/Map';

const UserMainNavigation = () => {
    return(
        <>
        <Navbar/>
        <Map/>
        <Footer/>
        </>
    );
};

export default UserMainNavigation;