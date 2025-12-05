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
  const messagesEndRef = useRef(null);

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
          inDialogueTree: data.data.inDialogueTree
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
        inDialogueTree: false
      };
    }
  };

  useEffect(() => {
    if (initialMessage) {
      // Add the user's initial message
      setMessages([{ type: "user", text: initialMessage }]);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Get response from API
      sendMessageToAPI(initialMessage).then((response) => {
        setMessages([
          { type: "user", text: initialMessage },
          { type: "bot", text: response.text, followUp: response.followUp }
        ]);
        setIsTyping(false);
      });
    }
  }, [initialMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const userMessage = inputValue.trim();
      const newUserMessage = { type: "user", text: userMessage };
      setMessages([...messages, newUserMessage]);
      setInputValue("");
      setError(null);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Get response from API
      const response = await sendMessageToAPI(userMessage);
      
      setMessages(prev => [
        ...prev,
        { type: "bot", text: response.text, followUp: response.followUp }
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
      <img 
        src="/cute-croc.png" 
        alt="Cute crocodile" 
        className="croc-character-right"
      />
      
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
                <div key={index}>
                  <div className={`message ${msg.type}-message`}>
                    <div className="message-bubble">
                      {msg.text}
                    </div>
                  </div>
                  {msg.followUp && msg.type === "bot" && (
                    <div className="follow-up-hint">
                      💡 {msg.followUp}
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
                className="chat-input"
                placeholder="What's on your mind mate?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
              />
              <button type="submit" className="send-button" disabled={isTyping}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


