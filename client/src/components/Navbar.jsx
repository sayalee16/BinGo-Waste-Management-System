import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <div>
          <img src="BinGo.webp" alt="BinGo Logo" width="150" height="50" />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
            aria-label="Toggle menu"
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
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex justify-center space-x-6 py-2">
        <a
          href="/login/userMainNavigation"
          className="hover:bg-white-400 px-4 py-2 rounded transition duration-300"
        >
          Home
        </a>
        <a
          href="/login/userReportForm"
          className="hover:bg-white-400 px-4 py-2 rounded transition duration-300"
        >
          User Report
        </a>
        <a
          href="/user-profile"
          className="hover:bg-white-400 px-4 py-2 rounded transition duration-300"
        >
          Profile
        </a>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white-400 px-4 py-2 space-y-2">
          <a
            href="/login/userMainNavigation"
            className="block text-center py-2 hover:bg-white-300 transition duration-300"
          >
            Home
          </a>
          <a
            href="/login/userReportForm"
            className="block text-center py-2 hover:bg-white-300 transition duration-300"
          >
            User Report
          </a>
          <a
            href="/user-profile"
            className="block text-center py-2 hover:bg-white-300 transition duration-300"
          >
            Profile
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
