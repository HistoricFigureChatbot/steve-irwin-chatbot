/**
 * ChatInput Component
 * Handles user message input with form submission
 * Provides disabled state during message processing
 * Dynamic placeholder based on typing state
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Input change handler
 * @param {Function} props.onSubmit - Form submit handler
 * @param {boolean} props.isTyping - Whether bot is currently typing
 * @returns {JSX.Element} Chat input form with text input and submit button
 */
export default function ChatInput({ value, onChange, onSubmit, isTyping }) {
  return (
    <form onSubmit={onSubmit} className="chat-input-form">
      <input
        type="text"
        className={isTyping ? "chat-input disabled" : "chat-input"}
        placeholder={isTyping ? "Steve is thinking..." : "Ask me about crocs, snakes, or conservation, mate!"}
        value={value}
        onChange={onChange}
        disabled={isTyping}
      />
      <button type="submit" className="send-button" disabled={isTyping}>
        Send it mate! 🐊
      </button>
    </form>
  );
}

