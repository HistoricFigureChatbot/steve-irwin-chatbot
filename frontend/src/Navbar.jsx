import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const dropdownRef = useRef(null);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-title-link">
          <h1 className="navbar-title">Steve Irwin Chatbot</h1>
        </Link>
      </div>
      <div className="navbar-center">
        <Link to="/chat" className="nav-link">
          Chat
        </Link>
        <Link to="/about" className="nav-link">
          About Me
        </Link>
        <Link to="/conservation" className="nav-link">
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
      </div>
    </nav>
  );
}
