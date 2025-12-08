import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useTheme } from "./ThemeContext.jsx";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
        <button 
          className="theme-toggle-btn" 
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <svg className="theme-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
            </svg>
          ) : (
            <svg className="theme-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5Zm0-8c-1.65,0-3,1.35-3,3s1.35,3,3,3,3-1.35,3-3-1.35-3-3-3Z"/>
              <path d="M12,7c-.55,0-1-.45-1-1V3c0-.55.45-1,1-1s1,.45,1,1v3c0,.55-.45,1-1,1Z"/>
              <path d="M12,22c-.55,0-1-.45-1-1v-3c0-.55.45-1,1-1s1,.45,1,1v3c0,.55-.45,1-1,1Z"/>
              <path d="M7,13H3c-.55,0-1-.45-1-1s.45-1,1-1h4c.55,0,1,.45,1,1s-.45,1-1,1Z"/>
              <path d="M21,13h-4c-.55,0-1-.45-1-1s.45-1,1-1h4c.55,0,1,.45,1,1s-.45,1-1,1Z"/>
              <path d="M6.34,8.34c-.26,0-.51-.1-.71-.29l-2.83-2.83c-.39-.39-.39-1.02,0-1.41.39-.39,1.02-.39,1.41,0l2.83,2.83c.39.39.39,1.02,0,1.41-.2.2-.45.29-.71.29Z"/>
              <path d="M20.49,22.49c-.26,0-.51-.1-.71-.29l-2.83-2.83c-.39-.39-.39-1.02,0-1.41.39-.39,1.02-.39,1.41,0l2.83,2.83c.39.39.39,1.02,0,1.41-.2.2-.45.29-.71.29Z"/>
              <path d="M17.66,8.34c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l2.83-2.83c.39-.39,1.02-.39,1.41,0,.39.39.39,1.02,0,1.41l-2.83,2.83c-.2.2-.45.29-.71.29Z"/>
              <path d="M3.51,22.49c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l2.83-2.83c.39-.39,1.02-.39,1.41,0,.39.39.39,1.02,0,1.41l-2.83,2.83c-.2.2-.45.29-.71.29Z"/>
            </svg>
          )}
        </button>
        
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
