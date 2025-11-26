import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-title-link" onClick={closeMobileMenu}>
          {!isHomePage && <img src="/steve.png" alt="Steve Irwin" className="navbar-logo" />}
          <h1 className={`navbar-title ${!isHomePage ? 'with-logo' : ''}`}>Steve Irwin</h1>
        </Link>
      </div>
      
      <div className={`navbar-center ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/chat" className="nav-link" onClick={closeMobileMenu}>
          Chat
        </Link>
        <Link to="/about" className="nav-link" onClick={closeMobileMenu}>
          About Me
        </Link>
        <Link to="/conservation" className="nav-link" onClick={closeMobileMenu}>
          Conservation
        </Link>
      </div>
      
      <div className="navbar-right">
        <div className="settings-container" ref={dropdownRef}>
          <button 
            className="settings-btn" 
            aria-label="Settings"
            onClick={toggleDropdown}
          >
            <img src="/settings.jpg" alt="Settings" className="settings-icon" />
          </button>
          {isDropdownOpen && (
            <div className="settings-dropdown">
              <div className="dropdown-item appearance-item">
                <span>Appearance</span>
                <button 
                  type="button"
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                >
                  <div className={`toggle-track ${isDarkMode ? 'dark' : 'light'}`}>
                    <span className="toggle-label">{isDarkMode ? 'Dark' : 'Light'}</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>
    </nav>
  );
}
