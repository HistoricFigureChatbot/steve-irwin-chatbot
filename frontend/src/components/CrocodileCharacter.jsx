import { useState, useRef } from 'react';

/**
 * CrocodileCharacter Component
 * Interactive crocodile character with snap animation and speech bubble
 * Displays different images based on snapping state
 * 
 * @returns {JSX.Element} Crocodile image with click interaction
 */
export default function CrocodileCharacter() {
  const [crocSnapping, setCrocSnapping] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [speechMessage, setSpeechMessage] = useState("Don't Click me I'll bite");
  const [hasBitten, setHasBitten] = useState(false);
  const timeoutRef = useRef(null);

  // Speech bubble messages for different click counts
  const messages = [
    "I'll Snap!",
    "Getting closer...",
    "Almost there...",
    "Gotcha!"
  ];

  /**
   * Handles crocodile click interaction
   * Triggers snap animation and speech bubble display
   */
  const handleCrocClick = () => {
    // Don't allow clicks after the bite
    if (hasBitten) return;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // Determine message based on click count
    const messageIndex = Math.min(newClickCount - 1, messages.length - 1);
    setSpeechMessage(messages[messageIndex]);
    
    setShowSpeechBubble(true);
    
    // Snap on the 4th click or later
    if (newClickCount >= 4) {
      setCrocSnapping(true);
      setHasBitten(true);
      
      // Reset snap animation after 1.5 seconds
      setTimeout(() => {
        setCrocSnapping(false);
      }, 1500);
      
      // Hide speech bubble after snap and don't bring it back
      timeoutRef.current = setTimeout(() => {
        setShowSpeechBubble(false);
      }, 2000);
    } else {
      // For clicks before snap, reset to default message
      timeoutRef.current = setTimeout(() => {
        setShowSpeechBubble(false);
        setTimeout(() => {
          setSpeechMessage("Don't Click me I'll bite");
          setShowSpeechBubble(true);
        }, 300);
      }, 2000);
    }
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
