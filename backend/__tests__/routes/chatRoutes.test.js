/**
 * Unit Tests for Express Routes and Chat Controller
 * Tests UT7 and UT14: Express Route /chat and Error Handling
 * 
 * UT7: Validate backend routing and JSON response format
 * UT14: Confirm Express gracefully handles invalid payloads
 */

import request from 'supertest';
import express from 'express';
import chatRoutes from '../../routes/chatRoutes.js';
import { loadConversations, loadResponses } from '../../services/dataLoader.js';

// Create test Express app
const app = express();
app.use(express.json());
app.use('/api', chatRoutes);

// Error handler for testing
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: err.message
  });
});

// Load data before running tests
beforeAll(async () => {
  try {
    await loadConversations();
    await loadResponses();
  } catch (error) {
    console.error('Failed to load test data:', error);
  }
});

describe('UT7: Express Route /chat - Valid Requests', () => {
  
  test('Should respond to POST /api/chat with valid message', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello' })
      .expect('Content-Type', /json/)
      .expect(200);

    // Verify response structure
    expect(response.body).toHaveProperty('success');
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('data');
  });

  test('Should return response with correct structure', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Tell me about crocodiles' });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('response');
    expect(response.body.data).toHaveProperty('topics');
    expect(response.body.data).toHaveProperty('isLLM');
    expect(typeof response.body.data.response).toBe('string');
    expect(Array.isArray(response.body.data.topics)).toBe(true);
  });

  test('Should handle greeting message', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Hi there!' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.response).toBeDefined();
    expect(response.body.data.response.length).toBeGreaterThan(0);
  });

  test('Should accept userId parameter', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ 
        message: 'Hello',
        userId: 'test-user-123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('Should include userId in response', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ 
        message: 'Hello',
        userId: 'test-user-456'
      });

    expect(response.body.data.userId).toBe('test-user-456');
  });
});

describe('UT14: Error Handling - Invalid Payloads', () => {
  
  test('Should return 400 for empty message', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: '' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Message is required');
  });

  test('Should return 400 for missing message field', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Message is required');
  });

  test('Should return 400 for whitespace-only message', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: '   ' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Message is required');
  });

  test('Should return 400 for non-string message', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 12345 })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('Should return 400 for null message', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: null })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('Should return 400 for array message', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: ['hello', 'world'] })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('Should return 400 for object message', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: { text: 'hello' } })
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

describe('UT7: Health Check Endpoint', () => {
  
  test('Should respond to GET /api/health', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('success');
    expect(response.body.success).toBe(true);
  });
});

describe('Additional Route Tests - CORS and Content-Type', () => {
  
  test('Should accept application/json content type', async () => {
    const response = await request(app)
      .post('/api/chat')
      .set('Content-Type', 'application/json')
      .send({ message: 'Hello' });

    expect(response.status).toBe(200);
  });

  test('Should handle very long messages', async () => {
    const longMessage = 'Tell me about crocodiles '.repeat(50);
    
    const response = await request(app)
      .post('/api/chat')
      .send({ message: longMessage });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
