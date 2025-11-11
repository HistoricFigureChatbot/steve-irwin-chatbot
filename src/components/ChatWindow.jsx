import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import ChatInput from './ChatInput'

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const initialMessages = [
  { id: makeId(), sender: 'bot', text: "G'day! I'm Steve — your friendly demo chatbot. Ask me anything.", time: new Date() },
]

export default function ChatWindow() {
  const [messages, setMessages] = useState(initialMessages)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToEnd()
  }, [messages, typing])

  function scrollToEnd() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }

  function botReplyFor(text) {
    const t = text.toLowerCase()
    if (t.includes('hello') || t.includes('hi')) return "Crikey! Hello there — how can I help you today?"
    if (t.includes('who') && t.includes('you')) return "I'm a demo chatbot inspired by a famous wildlife presenter."
    if (t.includes('help')) return "Try asking about the demo: say 'hello', or 'what can you do?'."
    if (t.includes('joke')) return "Why did the kangaroo stop drinking coffee? Because it made him jumpy!"
    // fallback — a short echo
    return `You said: "${text}" — that's interesting!`
  }

  function sendMessage(text) {
    if (!text || !text.trim()) return
    const userMessage = { id: makeId(), sender: 'user', text: text.trim(), time: new Date() }
    setMessages((m) => [...m, userMessage])

    // simulate bot typing
    setTyping(true)
    setTimeout(() => {
      const reply = botReplyFor(text)
      const botMessage = { id: makeId(), sender: 'bot', text: reply, time: new Date() }
      setMessages((m) => [...m, botMessage])
      setTyping(false)
    }, 700 + Math.random() * 800)
  }

  return (
    <div className="chat-app">
      <header className="chat-header">
        <div className="chat-title">Steve Demo Chat</div>
        <div className="chat-sub">A local frontend-only chatbot (no backend)</div>
      </header>

      <main className="chat-main" aria-live="polite">
        <div className="messages">
          {messages.map((m) => (
            <Message key={m.id} message={m} />
          ))}
          {typing && (
            <div className="typing-indicator">Steve is typing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="chat-footer">
        <ChatInput onSend={sendMessage} />
      </footer>
    </div>
  )
}
