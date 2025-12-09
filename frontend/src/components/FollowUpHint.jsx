/**
 * FollowUpHint Component
 * Displays follow-up suggestions with clickable topic chips
 * Extracts topics from follow-up text and renders them as interactive buttons
 * 
 * @param {Object} props - Component props
 * @param {string} props.followUp - Follow-up hint text (e.g., "💡 Try asking about: crocs, snakes, or conservation!")
 * @param {Function} props.onTopicClick - Callback function when topic chip is clicked
 * @returns {JSX.Element} Follow-up hint with clickable topic chips
 */
export default function FollowUpHint({ followUp, onTopicClick }) {
  /**
   * Extracts clickable topics from follow-up hint text
   * Parses text after "about:" or "about " and splits by commas and "or"
   * Uses manual string parsing (no regex) to extract topic keywords
   * 
   * @param {string} followUpText - Follow-up hint text
   * @returns {string[]} Array of topic strings (e.g., ["crocodiles", "snakes", "conservation"])
   * 
   * @example
   * extractTopics("💡 Try asking about: crocs, snakes, or conservation!")
   * // returns ["crocs", "snakes", "conservation"]
   */
  const extractTopics = (followUpText) => {
    if (!followUpText) return [];
    
    // Convert to lowercase for easier matching
    const lowerText = followUpText.toLowerCase();
    
    // Find "about:" or "about " in the text
    let startIndex = lowerText.indexOf('about:');
    if (startIndex === -1) {
      startIndex = lowerText.indexOf('about ');
    }
    
    if (startIndex === -1) return [];
    
    // Move past "about:" or "about "
    startIndex = startIndex + 6; // Skip "about:"
    
    // Find the end (either ! or . or end of string)
    let endIndex = followUpText.indexOf('!', startIndex);
    if (endIndex === -1) {
      endIndex = followUpText.indexOf('.', startIndex);
    }
    if (endIndex === -1) {
      endIndex = followUpText.length;
    }
    
    // Extract the substring
    const topicsString = followUpText.substring(startIndex, endIndex).trim();
    
    // Split by comma and "or" using manual parsing (no regex)
    const topics = [];
    let currentTopic = '';
    let i = 0;
    
    while (i < topicsString.length) {
      const char = topicsString[i];
      
      // Check if we hit a comma
      if (char === ',') {
        if (currentTopic.trim().length > 0) {
          topics.push(currentTopic.trim());
        }
        currentTopic = '';
        i++;
        continue;
      }
      
      // Check if we hit " or "
      if (i + 4 <= topicsString.length && 
          topicsString.substring(i, i + 4) === ' or ') {
        if (currentTopic.trim().length > 0) {
          topics.push(currentTopic.trim());
        }
        currentTopic = '';
        i += 4;
        continue;
      }
      
      currentTopic += char;
      i++;
    }
    
    // Add the last topic
    if (currentTopic.trim().length > 0) {
      topics.push(currentTopic.trim());
    }
    
    return topics;
  };

  const topics = extractTopics(followUp);

  return (
    <div className="follow-up-hint">
      <span className="hint-text">💡 {followUp}</span>
      <div className="suggested-topics">
        {topics.map((topic, idx) => (
          <button 
            key={idx}
            className="topic-chip"
            onClick={() => onTopicClick(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
