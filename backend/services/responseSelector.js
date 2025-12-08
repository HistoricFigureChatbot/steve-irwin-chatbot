/**
 * Response Selector
 * Handles response retrieval and probability-based selection
 */

let responses = {};

/**
 * Set responses data
 * @param {Object} responsesData - All chatbot responses
 */
export function setResponses(responsesData) {
  responses = responsesData;
}

/**
 * Get responses using dot notation path (e.g., "animals.crocodiles")
 * @param {string} path - Dot-separated path
 * @returns {Array|null} Array of responses or null
 */
export function getResponsesByPath(path) {
  const keys = path.split('.');
  let current = responses;
  
  for (const key of keys) {
    if (current[key] === undefined) {
      console.log(`⚠️ Path not found: ${path}`);
      return null;
    }
    current = current[key];
  }
  
  return current;
}

/**
 * Select response based on probability
 * @param {Array} topicResponses - Array of response objects
 * @returns {string|null} Selected response text or null
 */
export function selectResponseByProbability(topicResponses) {
  if (!Array.isArray(topicResponses) || topicResponses.length === 0) {
    return null;
  }
  
  const random = Math.random();
  let cumulative = 0;
  
  for (const response of topicResponses) {
    cumulative = cumulative + (response.probability || 0);
    if (random <= cumulative) {
      return response.text;
    }
  }
  
  return topicResponses[0].text;
}

/**
 * Get follow-up hint from response
 * @param {Array} topicResponses - Array of response objects
 * @param {string} selectedText - Selected response text
 * @returns {string|null} Follow-up hint or null
 */
export function getFollowUpHint(topicResponses, selectedText) {
  if (!Array.isArray(topicResponses)) return null;
  
  const responseObj = topicResponses.find(r => r.text === selectedText);
  return responseObj?.followUp || null;
}

/**
 * Get chatbot statistics
 * @returns {Object} Statistics about topics and patterns
 */
export function getStats() {
  const countTopics = (obj, prefix = '') => {
    let count = 0;
    let topics = [];
    
    for (const key in obj) {
      const value = obj[key];
      const fullKey = prefix ? prefix + '.' + key : key;
      
      if (Array.isArray(value)) {
        count = count + 1;
        topics.push(fullKey);
      } else if (typeof value === 'object' && value !== null) {
        const nested = countTopics(value, fullKey);
        count = count + nested.count;
        topics = topics.concat(nested.topics);
      }
    }
    
    return { count: count, topics: topics };
  };
  
  const stats = countTopics(responses);
  
  return {
    topicCount: stats.count,
    topics: stats.topics
  };
}
