import { processMessage, getStats } from '../services/chatService.js';

/**
 * Handle incoming chat messages
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
    const result = await processMessage(message);

    // Send response
    return res.status(200).json({
      success: true,
      data: {
        response: result.response,
        topic: result.topic,
        userId
      }
    });

  } catch (error) {
    console.error('Chat Error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Crikey! Something went wrong, mate!'
    });
  }
};

/**
 * Health check endpoint
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
