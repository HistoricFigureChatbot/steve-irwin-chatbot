import fs from 'fs/promises';
import { getLLMResponse } from './llmService.js';

// Simple in-memory storage for responses and conversations
let responses = {};
let conversations = {};

/**
 * Load responses from JSON file
 */
export async function loadResponses() {
  try {
    const data = await fs.readFile('./responses.json', 'utf-8');
    responses = JSON.parse(data);
    console.log('Loaded chatbot responses');
    return responses;
  } catch (error) {
    console.error('Error loading responses:', error);
    throw new Error('Failed to load responses');
  }
}

/**
 * Load conversations (topics and keywords) from JSON file
 */
export async function loadConversations() {
  try {
    const data = await fs.readFile('./data/conversations.json', 'utf-8');
    const conversationsData = JSON.parse(data);
    conversations = conversationsData.topics || {};
    console.log('Loaded conversation topics');
    return conversations;
  } catch (error) {
    console.error('Error loading conversations:', error);
    throw new Error('Failed to load conversations');
  }
}

/**
 * Find matching topic based on keywords in message
 * Uses conversations.json for keyword matching
 */
export async function findTopic(message) {
  if (!message) return ['default'];
  
  const messageLower = message.toLowerCase();
  const matchedTopics = [];
  
  // Loop through all topics in conversations.json
  for (const [topicName, topicData] of Object.entries(conversations)) {
    // Skip default topic - use as fallback
    if (topicName === 'default') continue;
    
    // Check if any keyword from this topic appears in the message
    for (const keyword of topicData.keywords) {
      if (messageLower.includes(keyword.toLowerCase())) {
        console.log(`Matched topic: ${topicName} (keyword: "${keyword}")`);
        matchedTopics.push(topicData.responseKey);
        break; // Only count each topic once
      }
    }
  }
  
  // No match found, return default
  if (matchedTopics.length === 0) {
    console.log('No topic match found, using default');
    return ['default'];
  }
  
  return matchedTopics;
}

/**
 * Get responses using dot notation path (e.g., "animals.crocodiles")
 */
function getResponsesByPath(path) {
  const keys = path.split('.');
  let current = responses;
  
  for (const key of keys) {
    if (current[key] === undefined) {
      console.log(`Path not found: ${path}, using default`);
      return responses.default;
    }
    current = current[key];
  }
  
  return current;
}

/**
 * Get a response for a topic using probability-based selection
 * Falls back to LLM if no scripted response exists OR if topic is 'default'
 */
export async function getResponse(topic, originalMessage = '') {
  // If topic is 'default', use LLM for more dynamic responses
  if (topic === 'default') {
    console.log('Default topic - using LLM for dynamic response');
    return {
      text: await getLLMResponse(originalMessage),
      isLLM: true
    };
  }
  
  const topicResponses = getResponsesByPath(topic);
  
  if (!Array.isArray(topicResponses) || topicResponses.length === 0) {
    console.log('No scripted response found, using LLM fallback');
    return {
      text: await getLLMResponse(originalMessage),
      isLLM: true
    };
  }
  
  // Select based on probability
  const random = Math.random();
  let cumulative = 0;
  
  for (const response of topicResponses) {
    cumulative += (response.probability || 0);
    if (random <= cumulative) {
      return {
        text: response.text,
        isLLM: false
      };
    }
  }
  
  // Fallback to first response
  return {
    text: topicResponses[0].text,
    isLLM: false
  };
}

/**
 * Main function to process a message and get response
 */
export async function processMessage(message) {
  const topics = await findTopic(message);
  const responses = [];
  
  // Get response for each matched topic
  for (const topic of topics) {
    const responseData = await getResponse(topic, message);
    responses.push(responseData.text);
    console.log(`Topic: ${topic} | LLM: ${responseData.isLLM} | Response: ${responseData.text.substring(0, 50)}...`);
  }
  
  // Combine all responses with double line break
  const combinedResponse = responses.join('\n\n');
  
  return {
    response: combinedResponse,
    topics: topics,
    isLLM: topics.includes('default')
  };
}

/**
 * Get chatbot statistics
 */
export function getStats() {
  const countTopics = (obj, prefix = '') => {
    let count = 0;
    let topics = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (Array.isArray(value)) {
        count++;
        topics.push(fullKey);
      } else if (typeof value === 'object' && value !== null) {
        const nested = countTopics(value, fullKey);
        count += nested.count;
        topics = topics.concat(nested.topics);
      }
    }
    
    return { count, topics };
  };
  
  const stats = countTopics(responses);
  
  return {
    topicCount: stats.count,
    topics: stats.topics
  };
}

// Initialize responses and conversations on module load
await loadResponses();
await loadConversations();
