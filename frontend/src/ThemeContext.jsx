/**
 * ThemeContext - Dark/Light Mode Theme Management
 * Provides global theme state and toggle functionality for the application
 * Persists theme preference to localStorage
 * 
 * Features:
 * - Dark/light mode toggle
 * - Persistent theme storage using localStorage
 * - Global theme context accessible from any component
 * - Automatic HTML data-theme attribute management
 */

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * ThemeProvider Component
 * Wraps the application to provide theme context
 * Manages theme state and localStorage synchronization
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 */
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  // Update theme attribute and localStorage when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  /**
   * Toggles between dark and light mode
   */
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * Custom hook to access theme context
 * Must be used within a ThemeProvider component
 * 
 * @returns {Object} Theme context with isDarkMode state and toggleTheme function
 * @throws {Error} If used outside of ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
