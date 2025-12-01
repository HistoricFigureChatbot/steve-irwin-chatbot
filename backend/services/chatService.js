import fs from 'fs/promises';
import { getLLMResponse } from './llmService.js';

// Simple in-memory storage for responses and conversations
let responses = {};
let conversations = {};
let questionPatterns = {};
let dialogueTrees = {};

// User session storage for tracking dialogue tree state
const userSessions = new Map();

/**
 * Get or create user session
 */
function getUserSession(userId = 'default') {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, {
      inDialogueTree: false,
      currentTree: null,
      lastTopic: null
    });
  }
  return userSessions.get(userId);
}

/**
 * Load responses from JSON file
 */
export async function loadResponses() {
  try {
    const data = await fs.readFile('./responses.json', 'utf-8');
    responses = JSON.parse(data);
    console.log('✅ Loaded chatbot responses');
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
    questionPatterns = conversationsData.questionPatterns || {};
    dialogueTrees = conversationsData.dialogueTrees || {};
    console.log('✅ Loaded conversation topics and question patterns');
    return conversations;
  } catch (error) {
    console.error('Error loading conversations:', error);
    throw new Error('Failed to load conversations');
  }
}

/**
 * Detect if the message is a specific question using patterns from JSON
 */
function isSpecificQuestion(message) {
  const messageLower = message.toLowerCase();
  
  // Check all question pattern categories
  for (const [category, patterns] of Object.entries(questionPatterns)) {
    for (const pattern of patterns) {
      if (messageLower.includes(pattern)) {
        console.log(`🔍 Detected question pattern: "${pattern}" (${category})`);
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Detect if message is a greeting
 */
function isGreeting(message) {
  const messageLower = message.toLowerCase();
  const greetingTopic = conversations.greetings;
  
  if (!greetingTopic) return false;
  
  for (const keyword of greetingTopic.keywords) {
    if (messageLower.includes(keyword.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

/**
 * Detect if message is a farewell
 */
function isFarewell(message) {
  const messageLower = message.toLowerCase();
  const farewellTopic = conversations.farewells;
  
  if (!farewellTopic) return false;
  
  for (const keyword of farewellTopic.keywords) {
    if (messageLower.includes(keyword.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

/**
 * Find matching dialogue tree node based on keywords
 */
function findDialogueTreeNode(message, currentTree = null) {
  const messageLower = message.toLowerCase();
  
  // If we're already in a dialogue tree, search within that tree first
  if (currentTree && dialogueTrees[currentTree]) {
    for (const [nodeName, nodeData] of Object.entries(dialogueTrees[currentTree])) {
      if (!nodeData.keywords) continue;
      
      for (const keyword of nodeData.keywords) {
        if (messageLower.includes(keyword.toLowerCase())) {
          console.log(`🌳 Found dialogue tree node: ${currentTree}.${nodeName}`);
          return {
            tree: currentTree,
            node: nodeName,
            responseKey: nodeData.responseKey
          };
        }
      }
    }
  }
  
  // Search all dialogue trees for a match
  for (const [treeName, treeNodes] of Object.entries(dialogueTrees)) {
    for (const [nodeName, nodeData] of Object.entries(treeNodes)) {
      if (!nodeData.keywords) continue;
      
      for (const keyword of nodeData.keywords) {
        if (messageLower.includes(keyword.toLowerCase())) {
          console.log(`🌳 Found dialogue tree: ${treeName}.${nodeName}`);
          return {
            tree: treeName,
            node: nodeName,
            responseKey: nodeData.responseKey
          };
        }
      }
    }
  }
  
  return null;
}

/**
 * Find matching topic based on keywords in message
 * Uses conversations.json for keyword matching
 */
export async function findTopic(message) {
  if (!message) return [];
  
  const messageLower = message.toLowerCase();
  const matchedTopics = [];
  
  // Loop through all topics in conversations.json
  for (const [topicName, topicData] of Object.entries(conversations)) {
    // Skip default topic - use as fallback
    if (topicName === 'default') continue;
    
    // Check if any keyword from this topic appears in the message
    for (const keyword of topicData.keywords) {
      if (messageLower.includes(keyword.toLowerCase())) {
        console.log(`✅ Matched topic: ${topicName} (keyword: "${keyword}")`);
        matchedTopics.push({
          name: topicName,
          responseKey: topicData.responseKey
        });
        break; // Only count each topic once
      }
    }
  }
  
  // No match found
  if (matchedTopics.length === 0) {
    console.log('⚠️ No topic match found');
    return [];
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
      console.log(`⚠️ Path not found: ${path}`);
      return null;
    }
    current = current[key];
  }
  
  return current;
}

/**
 * Select response based on probability
 */
function selectResponseByProbability(topicResponses) {
  if (!Array.isArray(topicResponses) || topicResponses.length === 0) {
    return null;
  }
  
  const random = Math.random();
  let cumulative = 0;
  
  for (const response of topicResponses) {
    cumulative += (response.probability || 0);
    if (random <= cumulative) {
      return response.text;
    }
  }
  
  return topicResponses[0].text;
}

/**
 * Main function to process message with smart routing and dialogue trees
 */
export async function processMessage(message, userId = 'default') {
  const userSession = getUserSession(userId);
  
  // Step 0: Check if user is in a dialogue tree
  const dialogueNode = findDialogueTreeNode(message, userSession.currentTree);
  
  if (dialogueNode) {
    console.log(`🌳 In dialogue tree: ${dialogueNode.tree}.${dialogueNode.node}`);
    
    // Update user session
    userSession.inDialogueTree = true;
    userSession.currentTree = dialogueNode.tree;
    userSession.lastTopic = dialogueNode.node;
    
    // Get dialogue tree response
    const treeResponses = getResponsesByPath(dialogueNode.responseKey);
    if (treeResponses && Array.isArray(treeResponses)) {
      const selectedResponse = selectResponseByProbability(treeResponses);
      
      // Extract followUp hint if exists
      const responseObj = treeResponses.find(r => r.text === selectedResponse);
      const followUpHint = responseObj?.followUp || null;
      
      return {
        response: selectedResponse,
        topics: [dialogueNode.tree, dialogueNode.node],
        isLLM: false,
        inDialogueTree: true,
        followUp: followUpHint
      };
    }
  }
  
  // Step 1: Check message type
  const isQuestion = isSpecificQuestion(message);
  const greeting = isGreeting(message);
  const farewell = isFarewell(message);
  
  console.log(`📊 Analysis - Question: ${isQuestion}, Greeting: ${greeting}, Farewell: ${farewell}`);
  
  // Step 2: Handle greetings (exit dialogue tree)
  if (greeting) {
    userSession.inDialogueTree = false;
    userSession.currentTree = null;
    
    const greetingResponses = responses.greetings;
    const responseText = selectResponseByProbability(greetingResponses);
    return {
      response: responseText,
      topics: ['greetings'],
      isLLM: false,
      inDialogueTree: false
    };
  }
  
  // Step 3: Handle farewells (exit dialogue tree)
  if (farewell) {
    userSession.inDialogueTree = false;
    userSession.currentTree = null;
    
    const farewellResponses = responses.farewells;
    const responseText = selectResponseByProbability(farewellResponses);
    return {
      response: responseText,
      topics: ['farewells'],
      isLLM: false,
      inDialogueTree: false
    };
  }
  
  // Step 4: Find topic matches
  const matchedTopics = await findTopic(message);
  
  // Step 5: No topic found - use LLM (exit dialogue tree)
  if (matchedTopics.length === 0) {
    userSession.inDialogueTree = false;
    userSession.currentTree = null;
    
    console.log('🤖 No topic match - using LLM');
    return {
      response: await getLLMResponse(message),
      topics: ['default'],
      isLLM: true,
      inDialogueTree: false
    };
  }
  
  // Step 6: Specific question about a topic - use LLM with context
  if (isQuestion) {
    console.log('🤖 Specific question detected - using LLM with context');
    
    // Build context from matched topics
    const contextParts = [];
    for (const topic of matchedTopics) {
      const topicResponses = getResponsesByPath(topic.responseKey);
      if (topicResponses && Array.isArray(topicResponses)) {
        // Take first 2 responses as context
        const contextTexts = topicResponses.slice(0, 2).map(r => r.text);
        contextParts.push(...contextTexts);
      }
    }
    
    // Create enhanced prompt with Steve Irwin context
    const context = contextParts.join(' ');
    const enhancedMessage = `You are Steve Irwin, the legendary wildlife expert and conservationist. Based on your knowledge: ${context}\n\nNow answer this question in Steve Irwin's enthusiastic style: ${message}`;
    
    return {
      response: await getLLMResponse(enhancedMessage),
      topics: matchedTopics.map(t => t.name),
      isLLM: true,
      context: 'enhanced',
      inDialogueTree: false
    };
  }
  
  // Step 7: General topic mention - use scripted response
  // Check if this should start a dialogue tree
  console.log('📝 General topic mention - using scripted response');
  const topic = matchedTopics[0];
  
  // Check if there's a dialogue tree for this topic name
  // Look for dialogue tree with same name as topic
  if (dialogueTrees[topic.name] && dialogueTrees[topic.name].start) {
    console.log(`🌳 Starting dialogue tree: ${topic.name}`);
    
    userSession.inDialogueTree = true;
    userSession.currentTree = topic.name;
    userSession.lastTopic = 'start';
    
    const responseKey = dialogueTrees[topic.name].start.responseKey;
    const treeResponses = getResponsesByPath(responseKey);
    
    if (treeResponses && Array.isArray(treeResponses)) {
      const selectedResponse = selectResponseByProbability(treeResponses);
      const responseObj = treeResponses.find(r => r.text === selectedResponse);
      const followUpHint = responseObj?.followUp || null;
      
      return {
        response: selectedResponse,
        topics: [topic.name, 'start'],
        isLLM: false,
        inDialogueTree: true,
        followUp: followUpHint
      };
    }
  }
  
  // Regular scripted response
  const topicResponses = getResponsesByPath(topic.responseKey);
  const responseText = selectResponseByProbability(topicResponses);
  
  if (!responseText) {
    console.log('⚠️ No scripted response - falling back to LLM');
    return {
      response: await getLLMResponse(message),
      topics: [topic.name],
      isLLM: true,
      inDialogueTree: false
    };
  }
  
  return {
    response: responseText,
    topics: [topic.name],
    isLLM: false,
    inDialogueTree: false
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
    topics: stats.topics,
    questionPatternCount: Object.values(questionPatterns).flat().length
  };
}

// Initialize responses and conversations on module load
await loadResponses();
await loadConversations();
