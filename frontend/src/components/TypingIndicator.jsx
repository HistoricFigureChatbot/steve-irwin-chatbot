/**
 * TypingIndicator Component
 * Displays animated typing indicator when bot is generating a response
 * Shows "Steve is typing" text with three animated dots
 * 
 * @returns {JSX.Element} Typing indicator with animated dots
 */
export default function TypingIndicator() {
  return (
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
  );
}
