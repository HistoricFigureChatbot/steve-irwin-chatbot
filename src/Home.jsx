import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Navigate to chat page with the initial message
      navigate("/chat", { state: { initialMessage: inputValue } });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="steve-image-container">
          <img 
            src="/steve.png" 
            alt="Steve Irwin" 
            className="steve-image"
          />
        </div>
        
        <h1 className="greeting-text">How are ya goin'?</h1>
        
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            className="home-input"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </form>
      </div>
    </div>
  );
}
