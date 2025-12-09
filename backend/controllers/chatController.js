/**
 * Chat Controller
 * Handles HTTP requests for chat endpoints
 * Validates user input and returns appropriate responses
 */

import { processMessage, getStats } from '../services/chatService.js';

/**
 * Handle incoming chat messages from users
 * Validates the message, processes it through the chat service, and returns a response
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.message - User's message text
 * @param {string} [req.body.userId='default'] - Optional user identifier
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with bot reply and metadata
 * 
 * @route POST /api/chat
 */
export const sendMessage = async (req, res) => {
  try {
    const { message, userId = 'default' } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ 
        success: false,
        error: 'Message is required' 
      });
    }

    // Process message and get response
    const result = await processMessage(message, userId);

    // Send response
    return res.status(200).json({
      success: true,
      data: {
        response: result.response,
        topics: result.topics,
        isLLM: result.isLLM,
        inDialogueTree: result.inDialogueTree,
        followUp: result.followUp || null,
        userId
      }
    });

  } catch (error) {
    console.error('Chat Error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Crikey! I\'m just out wrestling a crocodile at the moment mate. I\'ll be back soon!'
    });
  }
};

/**
 * Health check endpoint
 * Returns server status and statistics about available topics
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with server status and statistics
 * 
 * @route GET /api/health
 */
export const healthCheck = (req, res) => {
  try {
    const stats = getStats();

    return res.status(200).json({ 
      success: true,
      status: 'Crikey! Server is running beautifully!',
      data: {
        topics: stats.topics,
        topicCount: stats.topicCount,
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error('Health Check Error:', error);
    return res.status(503).json({
      success: false,
      error: 'Service Unavailable'
    });
  }
};
