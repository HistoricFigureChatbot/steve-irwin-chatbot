/**
 * Message Component
 * Displays a single chat message bubble with timestamp
 * Handles both user and bot message types with different styling
 * 
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object containing text, type, and timestamp
 * @param {string} props.message.type - Message type ('user' or 'bot')
 * @param {string} props.message.text - Message text content
 * @param {string} props.message.timestamp - ISO timestamp string
 * @returns {JSX.Element} Rendered message bubble
 */
export default function Message({ message }) {
  /**
   * Formats ISO timestamp to user-friendly time string
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} Formatted time (e.g., "2:30 PM")
   */
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`message ${message.type}-message`}>
      <div className="message-bubble">
        <p className="message-text">{message.text}</p>
        {message.timestamp && (
          <span className="message-time">{formatTime(message.timestamp)}</span>
        )}
      </div>
    </div>
  );
}
