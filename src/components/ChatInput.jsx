import React, { useCallback, useState } from 'react'

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState('')

  const handleSend = useCallback(() => {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
  }, [value, onSend])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-input">
      <textarea
        className="chat-textarea"
        placeholder="Type a message — press Enter to send"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
      />
      <button className="chat-send" onClick={handleSend} aria-label="Send message">Send</button>
    </div>
  )
}
