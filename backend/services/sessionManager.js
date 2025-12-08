/**
 * Session Manager
 * Handles user session storage and conversation history
 */

// User session storage for tracking dialogue tree state and conversation history
const userSessions = new Map();

/**
 * Get or create user session
 * @param {string} userId - User identifier
 * @returns {Object} User session object
 */
export function getUserSession(userId = 'default') {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, {
      inDialogueTree: false,
      currentTree: null,
      lastTopic: null,
      conversationHistory: []
    });
  }
  return userSessions.get(userId);
}

/**
 * Add message to conversation history
 * @param {string} userId - User identifier
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - Message content
 */
export function addToHistory(userId, role, content) {
  const userSession = getUserSession(userId);
  
  userSession.conversationHistory.push({
    role: role,
    content: content,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 6 messages (3 exchanges)
  if (userSession.conversationHistory.length > 6) {
    userSession.conversationHistory = userSession.conversationHistory.slice(-6);
  }
}

/**
 * Get conversation history context for LLM
 * @param {string} userId - User identifier
 * @param {number} count - Number of recent messages to include
 * @returns {string} Formatted history text
 */
export function getHistoryContext(userId, count = 4) {
  const userSession = getUserSession(userId);
  
  if (userSession.conversationHistory.length <= 1) {
    return '';
  }
  
  let historyText = 'Previous conversation:\n';
  const recentHistory = userSession.conversationHistory.slice(-count);
  
  for (let i = 0; i < recentHistory.length; i++) {
    const msg = recentHistory[i];
    historyText = historyText + msg.role + ': ' + msg.content + '\n';
  }
  
  return historyText + '\n';
}

/**
 * Clear user session
 * @param {string} userId - User identifier
 */
export function clearSession(userId) {
  userSessions.delete(userId);
}

/**
 * Get all active sessions count
 * @returns {number} Number of active sessions
 */
export function getActiveSessionsCount() {
  return userSessions.size;
}
