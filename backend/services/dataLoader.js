/**
 * Data Loader
 * Handles loading and initializing JSON data files
 * Uses proper path resolution for both local and Vercel serverless environments
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { setResponses } from './responseSelector.js';
import { setConversations, setQuestionPatterns } from './messageAnalyser.js';
import { setDialogueTrees } from './dialogueTreeHandler.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load responses from JSON file
 * @returns {Promise<Object>} Loaded responses
 */
export async function loadResponses() {
  try {
    // Try multiple paths for different environments
    const possiblePaths = [
      path.join(__dirname, '..', 'responses.json'),
      path.join(process.cwd(), 'responses.json'),
      './responses.json'
    ];

    let data;
    let loadedFrom;
    
    for (const responsesPath of possiblePaths) {
      try {
        data = await fs.readFile(responsesPath, 'utf-8');
        loadedFrom = responsesPath;
        break;
      } catch (err) {
        // Try next path
        continue;
      }
    }

    if (!data) {
      throw new Error('Could not find responses.json in any expected location');
    }

    const responsesData = JSON.parse(data);
    setResponses(responsesData);
    console.log(`✅ Loaded chatbot responses from ${loadedFrom}`);
    return responsesData;
  } catch (error) {
    console.error('Error loading responses:', error);
    throw new Error('Failed to load responses');
  }
}

/**
 * Load conversations (topics and keywords) from JSON file
 * @returns {Promise<Object>} Loaded conversations
 */
export async function loadConversations() {
  try {
    // Try multiple paths for different environments
    const possiblePaths = [
      path.join(__dirname, '..', 'data', 'conversations.json'),
      path.join(process.cwd(), 'data', 'conversations.json'),
      './data/conversations.json'
    ];

    let data;
    let loadedFrom;
    
    for (const conversationsPath of possiblePaths) {
      try {
        data = await fs.readFile(conversationsPath, 'utf-8');
        loadedFrom = conversationsPath;
        break;
      } catch (err) {
        // Try next path
        continue;
      }
    }

    if (!data) {
      throw new Error('Could not find conversations.json in any expected location');
    }

    const conversationsData = JSON.parse(data);

    const topics = conversationsData.topics || {};
    const patterns = conversationsData.questionPatterns || {};
    const trees = conversationsData.dialogueTrees || {};

    setConversations(topics);
    setQuestionPatterns(patterns);
    setDialogueTrees(trees);

    console.log(`✅ Loaded conversation topics and question patterns from ${loadedFrom}`);
    return topics;
  } catch (error) {
    console.error('Error loading conversations:', error);
    throw new Error('Failed to load conversations');
  }
}

/**
 * Initialize all data
 * @returns {Promise<void>}
 */
export async function initializeData() {
  await loadResponses();
  await loadConversations();
}
