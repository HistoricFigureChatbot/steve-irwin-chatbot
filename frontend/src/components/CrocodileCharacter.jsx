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

  /**
   * Handles crocodile click interaction
   * Triggers snap animation and speech bubble display
   */
  const handleCrocClick = () => {
    setShowSpeechBubble(true);
    setCrocSnapping(true);
    
    // Reset speech bubble after 2 seconds
    setTimeout(() => {
      setShowSpeechBubble(false);
    }, 2000);
    
    // Reset snap animation after 1.5 seconds
    setTimeout(() => {
      setCrocSnapping(false);
    }, 1500);
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
          I'll snap! 🐊
        </div>
      )}
    </div>
  );
}
