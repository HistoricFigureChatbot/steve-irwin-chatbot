/**
 * ChatPage Component
 * Main chat interface for conversing with Steve Irwin chatbot
 * Manages message state, API communication, and typing indicators
 * Integrates multiple child components for clean separation of concerns
 * 
 * Features:
 * - Real-time chat with backend API
 * - Typing indicators for better UX
 * - Message history with timestamps
 * - Clickable topic suggestions
 * - Error handling with user-friendly messages
 * - Auto-scroll to latest messages
 * - Initial message support from routing state
 */

import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import MessageList from "./components/MessageList";
import TypingIndicator from "./components/TypingIndicator";
import ChatInput from "./components/ChatInput";
import ErrorBanner from "./components/ErrorBanner";
import CrocodileCharacter from "./components/CrocodileCharacter";
import "./ChatPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Default greeting message shown on initial load
const defaultGreeting = {
  type: "bot",
  text: "G'day mate! I'm Steve Irwin, and I'm absolutely stoked to chat with you about wildlife!",
  followUp: "💡 Try asking me about: crocodiles, snakes, family, or conservation!",
  timestamp: new Date().toISOString()
};

export default function ChatPage() {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || "";
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  /**
   * Resets the chat to initial state with default greeting
   */
  const handleResetChat = () => {
    setMessages([defaultGreeting]);
    setInputValue("");
    setError(null);
    setIsTyping(false);
  };

  /**
   * Handles topic chip click from follow-up hints
   * Immediately sends the topic as a message
   * 
   * @param {string} topic - Topic string to send as message
   */
  const handleTopicClick = async (topic) => {
    const userMessage = topic.trim();
    const newUserMessage = { 
      type: "user", 
      text: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);
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
  };

  /**
   * Auto-scrolls chat container to show latest messages
   * Called when messages change or typing indicator appears
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  /**
   * Sends user message to backend API
   * Includes 800ms minimum delay for human-like response feel
   * Handles API errors gracefully with fallback messages
   * 
   * @param {string} messageText - User's message text
   * @returns {Promise<Object>} Response object with text, followUp, and timestamp
   */
  const sendMessageToAPI = async (messageText) => {
    try {
      // Add minimum delay to ensure typing indicator is visible and create human feel
      const [response] = await Promise.all([
        fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: messageText }),
        }),
        new Promise(resolve => setTimeout(resolve, 800)) // Minimum 800ms delay for human feel
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

  /**
   * Initializes chat on component mount
   * Handles initial message from routing state or shows default greeting
   * Sets up initial API call if message provided via navigation
   */
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

  /**
   * Handles form submission for sending messages
   * Prevents empty messages, manages typing state, and calls API
   * 
   * @param {Event} e - Form submit event
   */
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
      <CrocodileCharacter />
      
      <div className="chat-content">
        <div className="messages-wrapper">
          <div className="chat-container-box">
            <div className="chat-header">
              <button 
                className="reset-chat-btn"
                onClick={handleResetChat}
                title="Reset chat"
                aria-label="Reset chat"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M3 21v-5h5"></path>
                </svg>
                Reset Chat
              </button>
            </div>
            
            <ErrorBanner error={error} />
            
            <MessageList 
              messages={messages}
              messagesEndRef={messagesEndRef}
              onTopicClick={handleTopicClick}
            />
            
            {isTyping && <TypingIndicator />}
            
            <ChatInput 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleSubmit}
              isTyping={isTyping}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


