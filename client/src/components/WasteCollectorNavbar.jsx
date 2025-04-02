import React, { useState } from 'react';

const WCNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-green-300 shadow-md">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="BinGo.webp" alt="bingo-logo" className="h-6 mr-3" />
                    <h1 className="text-white text-2xl font-semibold">Waste Collector Dashboard</h1>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex space-x-6">
                    <a href="/reports-wc" className="text-white text-lg hover:text-green-200 transition duration-300">Reports</a>
                    <a href="/schedule" className="text-white text-lg hover:text-green-200 transition duration-300">Schedule</a>
                    <a href="/wc-profile" className="text-white text-lg hover:text-green-200 transition duration-300">Profile</a>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-green-400 py-2 space-y-2">
                    <a href="/reports-wc" className="block text-white text-center py-2 hover:bg-green-300">Reports</a>
                    <a href="/schedule" className="block text-white text-center py-2 hover:bg-green-300">Schedule</a>
                    <a href="/wc-profile" className="block text-white text-center py-2 hover:bg-green-300">Profile</a>
                </div>
            )}
        </nav>
    );
};

export default WCNavbar;
