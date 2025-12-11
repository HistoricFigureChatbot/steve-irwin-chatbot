/**
 * Jest Configuration for Backend Testing
 * Configured to work with ES modules
 */

export default {
  // Use Node environment for backend tests
  testEnvironment: 'node',
  
  // Transform ES modules to CommonJS for Jest
  transform: {},
  
  // File extensions Jest will look for
  moduleFileExtensions: ['js', 'json'],
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Coverage settings
  collectCoverageFrom: [
    'services/**/*.js',
    'controllers/**/*.js',
    '!**/__tests__/**'
  ],
  
  // Verbose output
  verbose: true,
};
