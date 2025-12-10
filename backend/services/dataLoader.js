/**
 * Data Loader
 * Handles loading and initializing JSON data files
 * Uses path.join with process.cwd() for Vercel serverless compatibility
 */

import fs from 'fs/promises';
import path from 'path';
import { setResponses } from './responseSelector.js';
import { setConversations, setQuestionPatterns } from './messageAnalyser.js';
import { setDialogueTrees } from './dialogueTreeHandler.js';

/**
 * Load responses from JSON file
 * @returns {Promise<Object>} Loaded responses
 */
export async function loadResponses() {
  try {
    const responsesPath = path.join(process.cwd(), 'responses.json');
    const data = await fs.readFile(responsesPath, 'utf-8');
    const responsesData = JSON.parse(data);
    setResponses(responsesData);
    console.log('✅ Loaded chatbot responses');
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
    const conversationsPath = path.join(process.cwd(), 'data', 'conversations.json');
    const data = await fs.readFile(conversationsPath, 'utf-8');
    const conversationsData = JSON.parse(data);

    const topics = conversationsData.topics || {};
    const patterns = conversationsData.questionPatterns || {};
    const trees = conversationsData.dialogueTrees || {};

    setConversations(topics);
    setQuestionPatterns(patterns);
    setDialogueTrees(trees);

    console.log('✅ Loaded conversation topics and question patterns');
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
