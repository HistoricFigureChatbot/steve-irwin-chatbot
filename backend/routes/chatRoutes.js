import express from 'express';
import { sendMessage, healthCheck } from '../controllers/chatController.js';

const router = express.Router();

/**
 * @route   POST /api/chat
 * @desc    Send a message to the chatbot
 * @access  Public
 * @body    { message: string, userId?: string }
 */

router.post('/chat', sendMessage);

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */

router.get('/health', healthCheck);

export default router;
