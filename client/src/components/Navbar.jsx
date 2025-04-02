import React from 'react';

const Navbar = () => {
    return (
        <>
            <div className="flex justify-between items-center p-3 bg-white shadow-md">
                
                <div>
                    <img src="BinGo.webp" alt="bingo-logo" width="120vw" height="50vh"/>
                </div>
            
            <ul className="flex justify-center space-x-6 text-lg font-medium">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
            </div>
        </>
    );
};

export default Navbar;