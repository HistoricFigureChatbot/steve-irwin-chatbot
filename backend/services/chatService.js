import fs from 'fs/promises';

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
  if (!message) return 'default';
  
  const messageLower = message.toLowerCase();
  
  // Loop through all topics in conversations.json
  for (const [topicName, topicData] of Object.entries(conversations)) {
    // Skip default topic - use as fallback
    if (topicName === 'default') continue;
    
    // Check if any keyword from this topic appears in the message
    for (const keyword of topicData.keywords) {
      if (messageLower.includes(keyword.toLowerCase())) {
        console.log(`Matched topic: ${topicName} (keyword: "${keyword}")`);
        return topicData.responseKey;
      }
    }
  }
  
  // No match found, return default
  console.log('No topic match found, using default');
  return 'default';
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
 */
export async function getResponse(topic) {
  const topicResponses = getResponsesByPath(topic);
  
  if (!Array.isArray(topicResponses) || topicResponses.length === 0) {
    return "Crikey! I'm not sure about that one, mate!";
  }
  
  // Select based on probability
  const random = Math.random();
  let cumulative = 0;
  
  for (const response of topicResponses) {
    cumulative += (response.probability || 0);
    if (random <= cumulative) {
      return response.text;
    }
  }
  
  // Fallback to first response
  return topicResponses[0].text;
}

/**
 * Main function to process a message and get response
 */
export async function processMessage(message) {
  const topic = await findTopic(message);
  const response = await getResponse(topic);
  
  console.log(`Topic: ${topic} | Response: ${response.substring(0, 50)}...`);
  
  return {
    response,
    topic
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
