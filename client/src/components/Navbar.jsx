import React, { useState } from 'react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="shadow-md">
            {/* Logo Section */}
            <div className=" py-2">
                <img src="BinGo.webp" alt="bingo-logo" width="170" height="50" />
            </div>

     </nav>
    );
};

export default Navbar;