import React, { useState } from 'react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>   
            <div className='item-center flex justify-center'>
                    <img src="BinGo.webp" alt="bingo-logo" width="150vw" height="50vh"/>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-green-400 py-2 space-y-2">
                    <a href="/" className="block text-white text-center py-2 hover:bg-green-300">Home</a>
                    <a href="/schedule" className="block text-white text-center py-2 hover:bg-green-300">Schedule</a>
                    <a href="/user-profile" className="block text-white text-center py-2 hover:bg-green-300">Profile</a>
                </div>
            )}
     </>
    );
};

export default Navbar;
