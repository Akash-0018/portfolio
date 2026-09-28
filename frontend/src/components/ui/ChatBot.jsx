import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, SendHorizontal, X } from 'lucide-react'
import { sendChatMessage, describeApiError } from '../../services/api'
import './ChatBot.css'

const GREETING =
  "Hey! I'm Akash's portfolio assistant. Ask me about the projects, the skills, or how to get in touch. I promise I only know about Akash, so please don't ask me to do your taxes."

const SUGGESTIONS = [
  'What does Akash work on?',
  'Show me the featured projects',
  'What is the tech stack?',
  'How do I contact Akash?',
]

// Matches the backend's caps in schemas/chat.py.
const MAX_HISTORY = 20
const MAX_CHARS = 1000

// Renders **bold** and "- " bullets without dangerouslySetInnerHTML: replies
// come from a model, so they are treated as text, never as markup.
function renderReply(text) {
  return text.split('\n').map((line, i) => {
    const bullet = /^\s*[-*•]\s+/.test(line)
    const body = bullet ? line.replace(/^\s*[-*•]\s+/, '') : line
    const parts = body.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
      part.startsWith('**') && part.endsWith('**') && part.length > 4
        ? <strong key={j}>{part.slice(2, -2)}</strong>
        : <Fragment key={j}>{part}</Fragment>
    )
    return (
      <div key={i} className={bullet ? 'chatbot-bullet' : undefined}>
        {bullet && <span aria-hidden="true">◈</span>}
        <span>{parts.length ? parts : ' '}</span>
      </div>
    )
  })
}

// The API wants a transcript that starts with a visitor message and stays
// within the history cap; the greeting is UI-only and never sent.
function toPayload(messages) {
  const recent = messages.slice(-MAX_HISTORY)
  const firstUser = recent.findIndex((m) => m.role === 'user')
  return recent.slice(firstUser).map(({ role, content }) => ({ role, content }))
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, pending, error])

  useEffect(() => {
    if (!open) return undefined
    inputRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const send = async (text) => {
    const content = text.trim().slice(0, MAX_CHARS)
    if (!content || pending) return

    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setError('')
    setPending(true)
    try {
      const res = await sendChatMessage(toPayload(next))
      setMessages((m) => [...m, { role: 'assistant', content: res.data.reply }])
    } catch (err) {
      setError(describeApiError(err, 'Something went sideways. Try again?'))
    } finally {
      setPending(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            className="chatbot-panel"
            role="dialog"
            aria-label="Chat about Akash"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="chatbot-header">
              <div>
                <div className="chatbot-title">
                  <span className="status-dot" aria-hidden="true" /> Akash // Assistant
                </div>
                <div className="chatbot-subtitle">Projects · Skills · Contact</div>
              </div>
              <button className="chatbot-icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">
                <X size={18} />
              </button>
            </header>

            <div className="chatbot-messages" ref={listRef} aria-live="polite">
              <div className="chatbot-msg assistant">{GREETING}</div>

              {messages.length === 0 && (
                <div className="chatbot-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="chatbot-chip" onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`chatbot-msg ${m.role}`}>
                  {m.role === 'assistant' ? renderReply(m.content) : m.content}
                </div>
              ))}

              {pending && (
                <div className="chatbot-msg assistant chatbot-typing" aria-label="Assistant is typing">
                  <span /><span /><span />
                </div>
              )}

              {error && <div className="chatbot-error">{error}</div>}
            </div>

            <form className="chatbot-input-row" onSubmit={onSubmit}>
              <textarea
                ref={inputRef}
                className="chatbot-input"
                rows={1}
                maxLength={MAX_CHARS}
                placeholder="Ask about projects, skills..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Your message"
              />
              <button
                type="submit"
                className="chatbot-send"
                disabled={pending || !input.trim()}
                aria-label="Send message"
              >
                <SendHorizontal size={18} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        className="chatbot-launcher"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Chat about Akash'}
        aria-expanded={open}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.94 }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>
    </>
  )
}
