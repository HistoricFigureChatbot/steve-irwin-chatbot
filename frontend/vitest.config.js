/**
 * Vitest Configuration for Frontend Testing
 * Configured for React component testing with jsdom
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom environment for DOM testing
    environment: 'jsdom',
    
    // Setup files to run before tests
    setupFiles: './src/__tests__/setup.js',
    
    // Global test APIs (describe, it, expect, etc.)
    globals: true,
    
    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
      ]
    }
  }
});
