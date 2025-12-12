/**
 * Chat Service - Main Message Processor
 * Orchestrates message handling using modular services
 */

import { getLLMResponse } from './llmService.js';
import { loadResponses, loadConversations } from './dataLoader.js';
import { getUserSession, addToHistory, getHistoryContext } from './sessionManager.js';
import { isGreeting, isFarewell, isSpecificQuestion, findTopic } from './messageAnalyser.js';
import { findDialogueTreeNode, hasDialogueTree, getDialogueTreeStart } from './dialogueTreeHandler.js';
import { getResponsesByPath, selectResponseByProbability, getFollowUpHint, getStats } from './responseSelector.js';

// Re-export for backwards compatibility
export { loadResponses, loadConversations, getStats };

// Track initialization state
let isInitialized = false;
let initializationPromise = null;

/**
 * Initialize data lazily (on first request)
 * This prevents blocking module load in serverless environments
 */
async function ensureInitialized() {
  if (isInitialized) return;

  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        console.log('Initializing chatbot data...');
        await loadResponses();
        await loadConversations();
        isInitialized = true;
        console.log('Chatbot data initialized successfully');
      } catch (error) {
        console.error('Failed to initialize chatbot data:', error);
        initializationPromise = null; // Allow retry on next request
        throw error;
      }
    })();
  }

  return initializationPromise;
}

/**
 * Main function to process user messages with intelligent routing
 * Handles dialogue trees, greetings, farewells, specific questions, and general topics
 * Uses modular services for message analysis, session management, and response selection
 * 
 * Processing flow:
 * 1. Check if user is in an active dialogue tree
 * 2. Detect greetings and farewells
 * 3. Handle specific questions (what, how, why, etc.)
 * 4. Search for topic-based responses
 * 5. Fall back to LLM for unhandled queries
 * 
 * @param {string} message - User's message text
 * @param {string} userId - Unique user identifier for session tracking (default: 'default')
 * @returns {Promise<Object>} Response object containing:
 *   - response: Bot's reply text
 *   - topics: Array of matched topics
 *   - isLLM: Whether response came from LLM
 *   - inDialogueTree: Whether user is in a dialogue tree
 *   - followUp: Optional follow-up hint
 */
export async function processMessage(message, userId = 'default') {
  // Ensure data is loaded before processing
  await ensureInitialized();

  const userSession = getUserSession(userId);

  // Store user message in history using sessionManager
  addToHistory(userId, 'user', message);

  // Step 0: Check if user is in a dialogue tree
  const dialogueNode = findDialogueTreeNode(message, userSession.currentTree);

  if (dialogueNode) {
    console.log(`In dialogue tree: ${dialogueNode.tree}.${dialogueNode.node}`);

    // Update user session
    userSession.inDialogueTree = true;
    userSession.currentTree = dialogueNode.tree;
    userSession.lastTopic = dialogueNode.node;

    // Get dialogue tree response
    const treeResponses = getResponsesByPath(dialogueNode.responseKey);
    if (treeResponses && Array.isArray(treeResponses)) {
      const selectedResponse = selectResponseByProbability(treeResponses);
      const followUpHint = getFollowUpHint(treeResponses, selectedResponse);

      // Store bot response in history
      addToHistory(userId, 'assistant', selectedResponse);

      return {
        response: selectedResponse,
        topics: [dialogueNode.tree, dialogueNode.node],
        isLLM: false,
        inDialogueTree: true,
        followUp: followUpHint
      };
    }
  }

  // Step 1: Check message type using messageAnalyzer
  const isQuestion = isSpecificQuestion(message);
  const greeting = isGreeting(message);
  const farewell = isFarewell(message);

  console.log(`Analysis - Question: ${isQuestion}, Greeting: ${greeting}, Farewell: ${farewell}`);

  // Step 2: Handle greetings (exit dialogue tree)
  if (greeting) {
    userSession.inDialogueTree = false;
    userSession.currentTree = null;

    const greetingResponses = getResponsesByPath('greetings');
    const responseText = selectResponseByProbability(greetingResponses);

    // Store bot response in history
    addToHistory(userId, 'assistant', responseText);

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

    const farewellResponses = getResponsesByPath('farewells');
    const responseText = selectResponseByProbability(farewellResponses);

    // Store bot response in history
    addToHistory(userId, 'assistant', responseText);

    return {
      response: responseText,
      topics: ['farewells'],
      isLLM: false,
      inDialogueTree: false
    };
  }

  // Step 4: Find topic matches using messageAnalyzer
  const matchedTopics = findTopic(message);

  // Step 5: No topic found - use LLM (exit dialogue tree)
  if (matchedTopics.length === 0) {
    userSession.inDialogueTree = false;
    userSession.currentTree = null;

    console.log('No topic match - using LLM');

    // Build context from conversation history using sessionManager
    const historyContext = getHistoryContext(userId, 4);
    const contextMessage = historyContext
      ? historyContext + '\nCurrent question: ' + message
      : message;

    const llmResponse = await getLLMResponse(contextMessage);

    // Store bot response in history
    addToHistory(userId, 'assistant', llmResponse);

    return {
      response: llmResponse,
      topics: ['default'],
      isLLM: true,
      inDialogueTree: false
    };
  }

  // Step 6: Specific question about a topic - use LLM with context
  if (isQuestion) {
    console.log('Specific question detected - using LLM with context');

    // Build context from matched topics using responseSelector
    const contextParts = [];
    for (const topic of matchedTopics) {
      const topicResponses = getResponsesByPath(topic.responseKey);
      if (topicResponses && Array.isArray(topicResponses)) {
        // Take first 2 responses as context
        const contextTexts = topicResponses.slice(0, 2).map(r => r.text);
        contextParts.push(...contextTexts);
      }
    }

    // Add conversation history to context using sessionManager
    const historyContext = getHistoryContext(userId, 4);

    // Create enhanced prompt with Steve Irwin context
    const context = contextParts.join(' ');
    const enhancedMessage = (historyContext ? historyContext + '\n\n' : '') +
      `You are Steve Irwin, the legendary wildlife expert and conservationist. Based on your knowledge: ${context}\n\nNow answer this question in Steve Irwin's enthusiastic style: ${message}`;

    const llmResponse = await getLLMResponse(enhancedMessage);

    // Store bot response in history
    addToHistory(userId, 'assistant', llmResponse);

    return {
      response: llmResponse,
      topics: matchedTopics.map(t => t.name),
      isLLM: true,
      context: 'enhanced',
      inDialogueTree: false
    };
  }

  // Step 7: General topic mention - use scripted response
  // Check if this should start a dialogue tree using dialogueTreeHandler
  console.log('General topic mention - using scripted response');
  const topic = matchedTopics[0];

  // Check if there's a dialogue tree for this topic name
  if (hasDialogueTree(topic.name)) {
    console.log(`Starting dialogue tree: ${topic.name}`);

    userSession.inDialogueTree = true;
    userSession.currentTree = topic.name;
    userSession.lastTopic = 'start';

    const startNode = getDialogueTreeStart(topic.name);
    const treeResponses = getResponsesByPath(startNode.responseKey);

    if (treeResponses && Array.isArray(treeResponses)) {
      const selectedResponse = selectResponseByProbability(treeResponses);
      const followUpHint = getFollowUpHint(treeResponses, selectedResponse);

      // Store bot response in history
      addToHistory(userId, 'assistant', selectedResponse);

      return {
        response: selectedResponse,
        topics: [topic.name, 'start'],
        isLLM: false,
        inDialogueTree: true,
        followUp: followUpHint
      };
    }
  }

  // Regular scripted response using responseSelector
  const topicResponses = getResponsesByPath(topic.responseKey);
  const responseText = selectResponseByProbability(topicResponses);

  if (!responseText) {
    console.log('WARNING: No scripted response - falling back to LLM');

    const llmResponse = await getLLMResponse(message);

    // Store bot response in history
    addToHistory(userId, 'assistant', llmResponse);

    return {
      response: llmResponse,
      topics: [topic.name],
      isLLM: true,
      inDialogueTree: false
    };
  }

  // Store bot response in history
  addToHistory(userId, 'assistant', responseText);

  return {
    response: responseText,
    topics: [topic.name],
    isLLM: false,
    inDialogueTree: false
  };
}
