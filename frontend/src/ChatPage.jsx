import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./ChatPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function ChatPage() {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || "";
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [crocSnapping, setCrocSnapping] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const messagesEndRef = useRef(null);

  // Default greeting message
  const defaultGreeting = {
    type: "bot",
    text: "G'day mate! I'm Steve Irwin, and I'm absolutely stoked to chat with you about wildlife!",
    followUp: "💡 Try asking me about: crocodiles, snakes, family, or conservation!",
    timestamp: new Date().toISOString()
  };

  // Extract clickable topics from follow-up hint
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
    
    // Split by comma and "or"
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

  // Handle topic chip click
  const handleTopicClick = (topic) => {
    setInputValue(topic);
  };

  // Format timestamp for display
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Function to send message to backend API
  const sendMessageToAPI = async (messageText) => {
    try {
      // Add minimum delay to ensure typing indicator is visible
      const [response] = await Promise.all([
        fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: messageText }),
        }),
        new Promise(resolve => setTimeout(resolve, 800)) // Minimum 800ms delay
      ]);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data?.response) {
        return {
          text: data.data.response,
          followUp: data.data.followUp,
          inDialogueTree: data.data.inDialogueTree,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error calling API:', err);
      setError("Crikey! I'm just out wrestling a crocodile at the moment mate. I'll be back soon!");
      return {
        text: "G'day! I'm having a bit of trouble right now, but I'll be back soon!",
        followUp: null,
        inDialogueTree: false,
        timestamp: new Date().toISOString()
      };
    }
  };

  useEffect(() => {
    if (initialMessage) {
      // Add the user's initial message
      setMessages([{ type: "user", text: initialMessage, timestamp: new Date().toISOString() }]);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Get response from API
      sendMessageToAPI(initialMessage).then((response) => {
        setMessages([
          { type: "user", text: initialMessage, timestamp: new Date().toISOString() },
          { type: "bot", text: response.text, followUp: response.followUp, timestamp: response.timestamp }
        ]);
        setIsTyping(false);
      });
    } else {
      // Show default greeting when no initial message
      setMessages([defaultGreeting]);
    }
  }, [initialMessage]);

  const handleCrocClick = () => {
    setShowSpeechBubble(true);
    setCrocSnapping(true);
    
    // Reset after animation
    setTimeout(() => {
      setShowSpeechBubble(false);
    }, 2000);
    
    setTimeout(() => {
      setCrocSnapping(false);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const userMessage = inputValue.trim();
      const newUserMessage = { 
        type: "user", 
        text: userMessage,
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, newUserMessage]);
      setInputValue("");
      setError(null);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Get response from API
      const response = await sendMessageToAPI(userMessage);
      
      setMessages(prev => [
        ...prev,
        { 
          type: "bot", 
          text: response.text, 
          followUp: response.followUp,
          timestamp: response.timestamp
        }
      ]);
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-page-container">
      {/* Decorative images positioned outside chat container */}
      <img 
        src="/steve-standing-with-koala.png" 
        alt="Steve Irwin with koala" 
        className="steve-character-left"
      />
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
      
      <div className="chat-content">
        <div className="messages-wrapper">
          <div className="chat-container-box">
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className="message-wrapper">
                  <div className={`message ${msg.type}-message`}>
                    <div className="message-bubble">
                      <p className="message-text">{msg.text}</p>
                      {msg.timestamp && (
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      )}
                    </div>
                  </div>
                  {msg.followUp && msg.type === "bot" && (
                    <div className="follow-up-hint">
                      <span className="hint-text">💡 {msg.followUp}</span>
                      <div className="suggested-topics">
                        {extractTopics(msg.followUp).map((topic, idx) => (
                          <button 
                            key={idx}
                            className="topic-chip"
                            onClick={() => handleTopicClick(topic)}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="message bot-message">
                  <div className="message-bubble typing-indicator">
                    <span>Steve is typing</span>
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="chat-input-form">
              <input
                type="text"
                className={isTyping ? "chat-input disabled" : "chat-input"}
                placeholder={isTyping ? "Steve is thinking..." : "Ask me about crocs, snakes, or conservation, mate!"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
              />
              <button type="submit" className="send-button" disabled={isTyping}>
                Send it mate! 🐊
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


