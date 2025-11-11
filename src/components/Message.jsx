import React from 'react'

export default function Message({ message }) {
  const { sender, text, time } = message
  const isUser = sender === 'user'

  return (
    <div className={`message-row ${isUser ? 'message-row--user' : 'message-row--bot'}`}>
      <div className={`message ${isUser ? 'message--user' : 'message--bot'}`}>
        <div className="message-text">{text}</div>
        <div className="message-time">{time instanceof Date ? time.toLocaleTimeString() : ''}</div>
      </div>
    </div>
  )
}
