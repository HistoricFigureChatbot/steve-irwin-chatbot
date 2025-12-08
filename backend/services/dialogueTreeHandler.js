/**
 * Dialogue Tree Handler
 * Manages dialogue tree navigation and node matching
 */

let dialogueTrees = {};

/**
 * Set dialogue trees data
 * @param {Object} treesData - Dialogue tree structure
 */
export function setDialogueTrees(treesData) {
  dialogueTrees = treesData;
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
  const textLower = text.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  
  let index = textLower.indexOf(keywordLower);
  
  while (index !== -1) {
    const charBefore = index > 0 ? textLower[index - 1] : ' ';
    const isValidBefore = !isLetter(charBefore);
    
    const charAfter = index + keywordLower.length < textLower.length 
      ? textLower[index + keywordLower.length] 
      : ' ';
    const isValidAfter = !isLetter(charAfter);
    
    if (isValidBefore && isValidAfter) {
      return true;
    }
    
    index = textLower.indexOf(keywordLower, index + 1);
  }
  
  return false;
}

/**
 * Find matching dialogue tree node based on keywords
 * @param {string} message - User message
 * @param {string} currentTree - Current tree name (optional)
 * @returns {Object|null} Matched node or null
 */
export function findDialogueTreeNode(message, currentTree = null) {
  const messageLower = message.toLowerCase();
  
  // If we're already in a dialogue tree, search within that tree first
  if (currentTree && dialogueTrees[currentTree]) {
    for (const nodeName in dialogueTrees[currentTree]) {
      const nodeData = dialogueTrees[currentTree][nodeName];
      
      if (!nodeData.keywords) continue;
      
      for (const keyword of nodeData.keywords) {
        // For dialogue tree navigation, use whole-word matching for single words
        // but allow partial matching for multi-word phrases
        const keywordLower = keyword.toLowerCase();
        if (keywordLower.indexOf(' ') !== -1) {
          // Multi-word phrase - use contains
          if (messageLower.indexOf(keywordLower) !== -1) {
            console.log(`🌳 Found dialogue tree node: ${currentTree}.${nodeName}`);
            return {
              tree: currentTree,
              node: nodeName,
              responseKey: nodeData.responseKey
            };
          }
        } else {
          // Single word - use whole-word matching
          if (matchesWholeWord(messageLower, keywordLower)) {
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
  }
  
  // Search all dialogue trees for a match
  for (const treeName in dialogueTrees) {
    const treeNodes = dialogueTrees[treeName];
    
    for (const nodeName in treeNodes) {
      const nodeData = treeNodes[nodeName];
      
      if (!nodeData.keywords) continue;
      
      for (const keyword of nodeData.keywords) {
        const keywordLower = keyword.toLowerCase();
        if (keywordLower.indexOf(' ') !== -1) {
          // Multi-word phrase
          if (messageLower.indexOf(keywordLower) !== -1) {
            console.log(`🌳 Found dialogue tree: ${treeName}.${nodeName}`);
            return {
              tree: treeName,
              node: nodeName,
              responseKey: nodeData.responseKey
            };
          }
        } else {
          // Single word
          if (matchesWholeWord(messageLower, keywordLower)) {
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
  }
  
  return null;
}

/**
 * Check if a dialogue tree exists for a topic
 * @param {string} topicName - Topic name
 * @returns {boolean} True if dialogue tree exists
 */
export function hasDialogueTree(topicName) {
  return dialogueTrees[topicName] && dialogueTrees[topicName].start;
}

/**
 * Get dialogue tree start node
 * @param {string} topicName - Topic name
 * @returns {Object|null} Start node data or null
 */
export function getDialogueTreeStart(topicName) {
  if (hasDialogueTree(topicName)) {
    return dialogueTrees[topicName].start;
  }
  return null;
}
