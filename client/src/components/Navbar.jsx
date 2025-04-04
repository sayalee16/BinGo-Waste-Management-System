import React, { useState, useEffect } from 'react';
import { Home, Calendar, User, Flag } from 'lucide-react';
import { useContext } from 'react'; // Importing useContext to access context values
import { AuthContext } from '../context/authContext'; // Importing AuthContext for user authentication

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePage, setActivePage] = useState('/');
    const { currUser } = useContext(AuthContext); // Accessing current user from AuthContext
  
  
  // Track scroll position for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
   
    window.addEventListener('scroll', handleScroll);
   
    // Set active page based on current path
    setActivePage(window.location.pathname);
   
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const navLinks = [
    { name: 'Home', path: '/userMainNavigation', icon: <Home size={18} /> },
    { name: 'Report', path: '/userReportForm', icon: <Flag size={18} /> },
  ];
  
  return (
    <nav className={`bg-gradient-to-r from-green-700 via-green-600 to-green-500 w-full sticky top-0 z-50 ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Container for all nav content */}
        <div className="flex items-center justify-between h-16">
          {/* Logo Area (Left) */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center">
              <span className="text-white text-2xl font-bold">Bin<span className="text-green-200">GO</span></span>

              <span className="text-white text-2xl font-bold ml-10">User Dashboard</span>
            </div>
          </div>
          
          {/* Desktop Navigation (Center) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className={`px-5 py-2 rounded-lg text-lg font-medium flex items-center space-x-1 transition-all duration-200
                    ${activePage === link.path
                      ? 'bg-white text-[#3EAD4B]'
                      : 'text-white hover:bg-green-600'}`}
                >
                  <span className="mr-1">{link.icon}</span>
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3 text-white">
  <User size={30} />
  <div className="flex flex-col">
    <span className="font-semibold text-lg"> Hey {currUser?.username || 'Admin'}</span>
    <div className="text-s text-gray-200 mt-1">
      {currUser?.username ? 
        "Your waste-saving journey begins!" :
        "You’re making a difference, one bin at a time!"}
    </div>
  </div>
</div>

          {/* Mobile Menu Button (Right) */}
          <div className="md:hidden flex items-center">
            <div className="flex items-center mr-4">
              <span className="text-white text-sm">Hello {currUser?.username || 'Guest'}</span>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white"
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
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 overflow-hidden">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`flex items-center px-4 py-3 text-[#3EAD4B] border-b border-gray-100 last:border-b-0
                  ${activePage === link.path ? 'bg-green-50 font-medium' : 'hover:bg-green-50'}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="mr-3">{link.icon}</span>
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
