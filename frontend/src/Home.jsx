/**
 * Home Component
 * Landing page for the Steve Irwin chatbot application
 * Features hero section with greeting, search input, and conversation starters
 * 
 * Features:
 * - Quick search input that navigates to chat with initial message
 * - 3 randomly selected conversation starter buttons
 * - Responsive design with Steve Irwin imagery
 * - Keyboard support (Enter to submit)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

// 10 different conversation starters
const conversationStarters = [
  { id: 1, question: "Want to know about my family?", message: "Tell me about your family" },
  { id: 2, question: "Tell me about crocodiles!", message: "Tell me about crocodiles" },
  { id: 3, question: "What's Australia Zoo like?", message: "Tell me about Australia Zoo" },
  { id: 4, question: "How do you handle dangerous animals?", message: "How do you handle dangerous animals" },
  { id: 5, question: "What's your passion?", message: "What's your passion for wildlife" },
  { id: 6, question: "Tell me about conservation!", message: "Tell me about conservation" },
  { id: 7, question: "What about snakes?", message: "Tell me about snakes" },
  { id: 8, question: "Share some wildlife facts!", message: "Tell me some wildlife facts" },
  { id: 9, question: "What was filming like?", message: "Tell me about filming the Crocodile Hunter" },
  { id: 10, question: "How can I help wildlife?", message: "How can I help with conservation" }
];

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [selectedStarters, setSelectedStarters] = useState([]);
  const navigate = useNavigate();

  /**
   * Picks 3 random conversation starters on component mount
   * Shuffles the array and selects first 3 items for variety
   */
  useEffect(() => {
    const shuffled = [...conversationStarters].sort(() => Math.random() - 0.5);
    setSelectedStarters(shuffled.slice(0, 3));
  }, []);

  /**
   * Handles form submission from search input
   * Navigates to chat page with the entered message as initial input
   * 
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Navigate to chat page with the initial message
      navigate("/chat", { state: { initialMessage: inputValue } });
    }
  };

  /**
   * Handles Enter key press in input field
   * Prevents shift+enter (for multiline support) and submits on regular enter
   * 
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  /**
   * Handles conversation starter button click
   * Navigates to chat page with predefined message
   * 
   * @param {string} message - Predefined conversation starter message
   */
  const handleStarterClick = (message) => {
    navigate("/chat", { state: { initialMessage: message } });
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="steve-image-container">
          <img 
            src="/steve.png" 
            alt="Steve Irwin Cartoon" 
            className="steve-image"
          />
        </div>
        
        <h1 className="greeting-text">How ya goin'?</h1>
        
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            className="home-input"
            placeholder="What's on ya mind mate?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </form>

        {/* Conversation starter buttons */}
        <div className="conversation-starters">
          {selectedStarters.map((starter) => (
            <button
              key={starter.id}
              className="starter-button"
              onClick={() => handleStarterClick(starter.message)}
            >
              {starter.question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
