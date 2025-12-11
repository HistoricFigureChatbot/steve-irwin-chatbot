/**
 * Unit Tests for ThemeContext
 * Tests UT13: Theme Manager
 * 
 * UT13: Verify light/dark mode switching works correctly
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

// Test component that uses theme
function TestComponent() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div>
      <p data-testid="theme-status">
        Current theme: {isDarkMode ? 'dark' : 'light'}
      </p>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}

describe('UT13: Theme Manager - Light/Dark Mode Switching', () => {
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document theme attribute
    document.documentElement.removeAttribute('data-theme');
  });

  test('Should initialize with light theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const status = screen.getByTestId('theme-status');
    expect(status).toHaveTextContent('Current theme: light');
  });

  test('Should initialize with dark theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const status = screen.getByTestId('theme-status');
    expect(status).toHaveTextContent('Current theme: dark');
  });

  test('Should toggle from light to dark', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button', { name: /Toggle Theme/i });
    const status = screen.getByTestId('theme-status');
    
    // Initial state should be light
    expect(status).toHaveTextContent('Current theme: light');
    
    // Toggle to dark
    await user.click(button);
    expect(status).toHaveTextContent('Current theme: dark');
  });

  test('Should toggle from dark to light', async () => {
    const user = userEvent.setup();
    localStorage.setItem('theme', 'dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button', { name: /Toggle Theme/i });
    const status = screen.getByTestId('theme-status');
    
    // Initial state should be dark
    expect(status).toHaveTextContent('Current theme: dark');
    
    // Toggle to light
    await user.click(button);
    expect(status).toHaveTextContent('Current theme: light');
  });

  test('Should update DOM root theme class on toggle', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button', { name: /Toggle Theme/i });
    
    // Check initial state
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    
    // Toggle to dark
    await user.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    // Toggle back to light
    await user.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  test('Should persist theme to localStorage', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button', { name: /Toggle Theme/i });
    
    // Toggle to dark
    await user.click(button);
    expect(localStorage.getItem('theme')).toBe('dark');
    
    // Toggle to light
    await user.click(button);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('Should toggle multiple times correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button', { name: /Toggle Theme/i });
    const status = screen.getByTestId('theme-status');
    
    // Light -> Dark
    await user.click(button);
    expect(status).toHaveTextContent('Current theme: dark');
    
    // Dark -> Light
    await user.click(button);
    expect(status).toHaveTextContent('Current theme: light');
    
    // Light -> Dark again
    await user.click(button);
    expect(status).toHaveTextContent('Current theme: dark');
  });

  test('Should provide theme context to child components', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Verify child component can access theme
    const status = screen.getByTestId('theme-status');
    expect(status).toBeInTheDocument();
  });
});

describe('Theme Manager - localStorage Integration', () => {
  
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  test('Should sync theme with localStorage on mount', () => {
    localStorage.setItem('theme', 'dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('Should handle invalid localStorage values gracefully', () => {
    localStorage.setItem('theme', 'invalid-value');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Should default to light mode for invalid values
    const status = screen.getByTestId('theme-status');
    expect(status).toHaveTextContent('Current theme: light');
  });
});
