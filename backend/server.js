/**
 * Steve Irwin Chatbot API Server
 * 
 * Main Express server that provides the backend API for the Steve Irwin chatbot.
 * Handles CORS, JSON parsing, routing, and error handling.
 * Can run locally or be deployed to Vercel as a serverless function.
 */

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import chatRoutes from './routes/chatRoutes.js';

// Initialize Express app
const app = express();

/**
 * Middleware Setup
 * Configures CORS to allow frontend communication
 * Enables JSON request body parsing
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes
 * Mounts all chat-related endpoints under /api prefix
 */
app.use('/api', chatRoutes);

/**
 * 404 Handler
 * Catches requests to non-existent endpoints and returns a Steve Irwin-themed error
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'Crikey! That endpoint doesn\'t exist, mate!'
  });
});

/**
 * Global Error Handler
 * Catches any unhandled errors and returns a 500 response
 * Logs error details to the console for debugging
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Something went terribly wrong!'
  });
});

/**
 * Start Server (Local Development Only)
 * Initializes the Express server on the specified port
 * Only runs when not deployed to Vercel
 */
const PORT = process.env.PORT || 3001;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(` Steve Irwin Chatbot API Server`);
    console.log(` Running on: http://localhost:${PORT}`);
    console.log(` API Endpoint: http://localhost:${PORT}/api`);
    console.log(`Status: Ready to chat!`);
    console.log('='.repeat(50));
  });
}

// Export for Vercel serverless
export default app;

