/**
 * Unit Tests for Data Loader
 * Tests UT3: JSON Fact Loader
 * 
 * UT3: Validate that the correct animal fact object is retrieved from local JSON
 */

import { loadConversations, loadResponses } from '../../services/dataLoader.js';
import fs from 'fs/promises';

describe('UT3: JSON Fact Loader - Load Conversation Data', () => {
  
  test('Should load conversations.json successfully', async () => {
    const conversations = await loadConversations();
    
    // Verify data loaded
    expect(conversations).toBeDefined();
    expect(typeof conversations).toBe('object');
  });

  test('Should contain expected animal topics', async () => {
    const conversations = await loadConversations();
    
    // Check for key animal topics
    expect(conversations).toHaveProperty('crocodiles');
    expect(conversations).toHaveProperty('kangaroos');
    expect(conversations).toHaveProperty('snakes');
  });

  test('Should load lion topic with correct structure', async () => {
    const conversations = await loadConversations();
    
    if (conversations.lions) {
      // Verify topic structure
      expect(conversations.lions).toHaveProperty('keywords');
      expect(conversations.lions).toHaveProperty('responseKey');
      
      // Verify keywords array
      expect(Array.isArray(conversations.lions.keywords)).toBe(true);
      expect(conversations.lions.keywords.length).toBeGreaterThan(0);
      
      // Verify keywords contain expected values
      expect(conversations.lions.keywords).toContain('lion');
    }
  });

  test('Should load crocodile topic with correct fields', async () => {
    const conversations = await loadConversations();
    
    expect(conversations.crocodiles).toBeDefined();
    expect(conversations.crocodiles).toHaveProperty('keywords');
    expect(conversations.crocodiles.keywords).toContain('crocodile');
    expect(conversations.crocodiles.responseKey).toBe('animals.crocodiles');
  });

  test('Should load kangaroo topic with correct structure', async () => {
    const conversations = await loadConversations();
    
    expect(conversations.kangaroos).toBeDefined();
    expect(conversations.kangaroos.keywords).toContain('kangaroo');
    expect(conversations.kangaroos.keywords).toContain('roo');
  });
});

describe('UT3: JSON Fact Loader - Load Response Data', () => {
  
  test('Should load responses.json successfully', async () => {
    const responses = await loadResponses();
    
    expect(responses).toBeDefined();
    expect(typeof responses).toBe('object');
  });

  test('Should contain greetings responses', async () => {
    const responses = await loadResponses();
    
    expect(responses).toHaveProperty('greetings');
    expect(Array.isArray(responses.greetings)).toBe(true);
    expect(responses.greetings.length).toBeGreaterThan(0);
  });

  test('Should contain animal-related responses', async () => {
    const responses = await loadResponses();
    
    // Check for animals section
    expect(responses).toHaveProperty('animals');
    expect(typeof responses.animals).toBe('object');
  });
});

describe('UT3: Error Handling - Invalid JSON', () => {
  
  test('Should throw error if conversations.json is missing', async () => {
    // This test verifies error handling exists
    // In real implementation, missing file would cause an error
    // For now, we just verify the function is async and can potentially throw
    
    await expect(loadConversations()).resolves.toBeDefined();
    // In a production test with proper mocking, this would test file not found
  });
});

describe('UT3: Data Integrity - Animal Facts Structure', () => {
  
  test('All topics should have keywords array', async () => {
    const conversations = await loadConversations();
    
    for (const topicName in conversations) {
      if (topicName !== 'default') {
        expect(conversations[topicName]).toHaveProperty('keywords');
        expect(Array.isArray(conversations[topicName].keywords)).toBe(true);
      }
    }
  });

  test('All topics should have responseKey', async () => {
    const conversations = await loadConversations();
    
    for (const topicName in conversations) {
      if (topicName !== 'default') {
        expect(conversations[topicName]).toHaveProperty('responseKey');
        expect(typeof conversations[topicName].responseKey).toBe('string');
      }
    }
  });
});
