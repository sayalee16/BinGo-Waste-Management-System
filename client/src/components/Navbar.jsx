import React, { useState } from 'react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-green-400 shadow-md">
            {/* Logo Section */}
            <div className="flex items-center justify-center py-4">
                <img src="BinGo.webp" alt="bingo-logo" width="150" height="50" />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex justify-center">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-green-400 py-2 space-y-2">
                    <a href="/" className="block text-white text-center py-2 hover:bg-green-300">
                        Home
                    </a>
                    <a href="/schedule" className="block text-white text-center py-2 hover:bg-green-300">
                        Schedule
                    </a>
                    <a href="/user-profile" className="block text-white text-center py-2 hover:bg-green-300">
                        Profile
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;