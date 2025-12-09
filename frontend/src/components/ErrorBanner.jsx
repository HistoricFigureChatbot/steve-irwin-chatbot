/**
 * ErrorBanner Component
 * Displays error messages in a banner at the top of the chat
 * 
 * @param {Object} props - Component props
 * @param {string} props.error - Error message to display
 * @returns {JSX.Element|null} Error banner or null if no error
 */
export default function ErrorBanner({ error }) {
  if (!error) return null;
  
  return (
    <div className="error-banner">
      {error}
    </div>
  );
}
