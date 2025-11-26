import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', chatRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'Crikey! That endpoint doesn\'t exist, mate!'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Something went terribly wrong!'
  });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(` Steve Irwin Chatbot API Server`);
  console.log(` Running on: http://localhost:${PORT}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api`);
  console.log(`Status: Ready to chat!`);
  console.log('='.repeat(50));
});

