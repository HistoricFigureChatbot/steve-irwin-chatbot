import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./ChatPage.css";

export default function ChatPage() {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || "";
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (initialMessage) {
      // Add the user's initial message
      setMessages([{ type: "user", text: initialMessage }]);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Simulate bot response after a delay
      setTimeout(() => {
        setMessages([
          { type: "user", text: initialMessage },
          { type: "bot", text: "Crikey! That's a ripper of a question, mate! Let me tell ya..." }
        ]);
        setIsTyping(false);
      }, 1500);
    }
  }, [initialMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newUserMessage = { type: "user", text: inputValue };
      setMessages([...messages, newUserMessage]);
      setInputValue("");
      
      // Show typing indicator
      setIsTyping(true);
      
      // Simulate bot response after a delay
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { type: "bot", text: "G'day! I'm working on getting you a proper response, mate!" }
        ]);
        setIsTyping(false);
      }, 1500);
    }
  };

  return (
    <div className="chat-page-container">
      <Navbar />
      <div className="chat-content">
        <div className="messages-wrapper">
          <div className="chat-container-box">
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.type}-message`}>
                  <div className="message-bubble">
                    {msg.text}
                  </div>
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
            </div>
            
            <form onSubmit={handleSubmit} className="chat-input-form">
              <input
                type="text"
                className="chat-input"
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="send-button">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
