/**
 * Message Analyzer
 * Detects message types (greetings, farewells, questions) and matches topics
 */

let conversations = {};
let questionPatterns = {};

/**
 * Set conversations data
 * @param {Object} conversationsData - Topics and keywords
 */
export function setConversations(conversationsData) {
  conversations = conversationsData;
}

/**
 * Set question patterns data
 * @param {Object} patternsData - Question pattern mappings
 */
export function setQuestionPatterns(patternsData) {
  questionPatterns = patternsData;
}

/**
 * Helper function to check if a character is a letter
 * @param {string} char - Character to check
 * @returns {boolean} True if letter
 */
function isLetter(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}

/**
 * Check if a keyword matches as a whole word (not part of another word)
 * @param {string} text - Text to search in
 * @param {string} keyword - Keyword to find
 * @returns {boolean} True if whole word match found
 */
function matchesWholeWord(text, keyword) {
  // Convert both to lowercase for case-insensitive comparison
  const textLower = text.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  
  // Find all occurrences of the keyword
  let index = textLower.indexOf(keywordLower);
  
  while (index !== -1) {
    // Check character before keyword (should be non-letter or start of string)
    const charBefore = index > 0 ? textLower[index - 1] : ' ';
    const isValidBefore = !isLetter(charBefore);
    
    // Check character after keyword (should be non-letter or end of string)
    const charAfter = index + keywordLower.length < textLower.length 
      ? textLower[index + keywordLower.length] 
      : ' ';
    const isValidAfter = !isLetter(charAfter);
    
    // If both boundaries are valid, it's a whole word match
    if (isValidBefore && isValidAfter) {
      return true;
    }
    
    // Look for next occurrence
    index = textLower.indexOf(keywordLower, index + 1);
  }
  
  return false;
}

/**
 * Detect if message is a greeting using whole-word matching
 * @param {string} message - User message
 * @returns {boolean} True if greeting detected
 */
export function isGreeting(message) {
  const messageLower = message.toLowerCase();
  const greetingTopic = conversations.greetings;
  
  if (!greetingTopic) return false;
  
  console.log(`🔍 Checking if "${message}" is a greeting...`);
  
  for (const keyword of greetingTopic.keywords) {
    // Use whole-word matching to avoid false positives like "which" matching "hi"
    const isMatch = matchesWholeWord(messageLower, keyword);
    console.log(`  - Checking keyword "${keyword}": ${isMatch}`);
    if (isMatch) {
      console.log(`👋 Detected greeting: "${keyword}"`);
      return true;
    }
  }
  
  console.log(`  ❌ No greeting match found`);
  return false;
}

/**
 * Detect if message is a farewell using whole-word matching
 * @param {string} message - User message
 * @returns {boolean} True if farewell detected
 */
export function isFarewell(message) {
  const messageLower = message.toLowerCase();
  const farewellTopic = conversations.farewells;
  
  if (!farewellTopic) return false;
  
  for (const keyword of farewellTopic.keywords) {
    // Use whole-word matching
    if (matchesWholeWord(messageLower, keyword)) {
      console.log(`👋 Detected farewell: "${keyword}"`);
      return true;
    }
  }
  
  return false;
}

/**
 * Detect if the message is a specific question using patterns from JSON
 * @param {string} message - User message
 * @returns {boolean} True if specific question detected
 */
export function isSpecificQuestion(message) {
  const messageLower = message.toLowerCase();
  
  // Check all question pattern categories
  for (const category in questionPatterns) {
    const patterns = questionPatterns[category];
    for (const pattern of patterns) {
      if (messageLower.indexOf(pattern) !== -1) {
        console.log(`🔍 Detected question pattern: "${pattern}" (${category})`);
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Find matching topic based on keywords in message
 * Uses conversations.json for keyword matching
 * @param {string} message - User message
 * @returns {Array} Array of matched topics
 */
export function findTopic(message) {
  if (!message) return [];
  
  const messageLower = message.toLowerCase();
  const matchedTopics = [];
  
  // Loop through all topics in conversations.json
  for (const topicName in conversations) {
    const topicData = conversations[topicName];
    
    // Skip default topic - use as fallback
    if (topicName === 'default') continue;
    
    // Check if any keyword from this topic appears in the message using whole-word matching
    for (const keyword of topicData.keywords) {
      if (matchesWholeWord(messageLower, keyword)) {
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
