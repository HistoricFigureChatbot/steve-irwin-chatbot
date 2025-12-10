import { useState } from 'react';

/**
 * CrocodileCharacter Component
 * Interactive crocodile character with snap animation and speech bubble
 * Displays different images based on snapping state
 * 
 * @returns {JSX.Element} Crocodile image with click interaction
 */
export default function CrocodileCharacter() {
  const [crocSnapping, setCrocSnapping] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [speechMessage, setSpeechMessage] = useState('');

  // Speech bubble messages for different click counts
  const messages = [
    "I'll Snap!",
    "Getting closer...",
    "Almost there...",
    "Here it comes!"
  ];

  /**
   * Handles crocodile click interaction
   * Triggers snap animation and speech bubble display
   */
  const handleCrocClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // Determine message based on click count
    const messageIndex = Math.min(newClickCount - 1, messages.length - 1);
    setSpeechMessage(messages[messageIndex]);
    
    setShowSpeechBubble(true);
    
    // Snap on the 4th click or later
    if (newClickCount >= 4) {
      setCrocSnapping(true);
      
      // Reset snap animation and counter after 1.5 seconds
      setTimeout(() => {
        setCrocSnapping(false);
        setClickCount(0);
      }, 1500);
    }
    
    // Reset speech bubble after 2 seconds
    setTimeout(() => {
      setShowSpeechBubble(false);
    }, 2000);
  };

  return (
    <div className="croc-container">
      <img 
        src={crocSnapping ? "/croc-snap.png" : "/cute-croc.png"}
        alt="Cute crocodile" 
        className={`croc-character-right ${crocSnapping ? 'snapping' : ''}`}
        onClick={handleCrocClick}
      />
      {showSpeechBubble && (
        <div className="croc-speech-bubble">
          {speechMessage}
        </div>
      )}
    </div>
  );
}
