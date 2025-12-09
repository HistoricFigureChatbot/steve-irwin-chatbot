import Message from './Message';
import FollowUpHint from './FollowUpHint';

/**
 * MessageList Component
 * Displays list of chat messages with follow-up hints
 * Handles message rendering and automatic scroll reference
 * 
 * @param {Object} props - Component props
 * @param {Array} props.messages - Array of message objects
 * @param {Object} props.messagesEndRef - Ref for auto-scrolling to bottom
 * @param {Function} props.onTopicClick - Callback when topic chip is clicked
 * @returns {JSX.Element} Scrollable list of messages
 */
export default function MessageList({ messages, messagesEndRef, onTopicClick }) {
  return (
    <div className="messages-container">
      {messages.map((msg, index) => (
        <div key={index} className="message-wrapper">
          <Message message={msg} />
          {msg.followUp && msg.type === "bot" && (
            <FollowUpHint 
              followUp={msg.followUp} 
              onTopicClick={onTopicClick} 
            />
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
