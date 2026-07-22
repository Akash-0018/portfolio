import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setDone(true)
            setTimeout(onComplete, 500)
          }, 200)
          return 100
        }
        return p + Math.random() * 10 + 3
      })
    }, 50)
    return () => clearInterval(interval)
  }, [onComplete])

  const lines = [
    '> Initializing AI System OS...',
    '> Loading model context...',
    '> Connecting vector retrieval engine...',
    '> Booting agentic runtime...',
    '> System online.',
  ]

  const visibleLines = Math.floor((progress / 100) * lines.length)

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: '#121212',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Minimal Circular Progress Indicator - Champagne Accent */}
            <div style={{ position: 'relative', width: 72, height: 72, marginBottom: '2rem' }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="#3A3A3A"
                  strokeWidth="1.5"
                />
                <motion.circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="#D9C8A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 30}`}
                  strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress / 100)}`}
                  style={{ transformOrigin: '36px 36px', rotate: '-90deg' }}
                  transition={{ duration: 0.1 }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  color: '#D9C8A3',
                  fontWeight: 600,
                }}
              >
                {Math.min(Math.floor(progress), 100)}%
              </div>
            </div>

            {/* Clean Centered Terminal Log */}
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                lineHeight: 1.9,
                minHeight: '7.5rem',
                textAlign: 'left',
                width: '100%',
                padding: '1.25rem',
                background: '#1E1E1E',
                border: '1px solid #3A3A3A',
                borderRadius: '16px',
              }}
            >
              {lines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: i === visibleLines - 1 ? '#D9C8A3' : 'var(--text-muted)' }}
                >
                  {line}
                </motion.div>
              ))}
            </div>

            {/* Brand Logo - Champagne Identity */}
            <div
              style={{
                marginTop: '2rem',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                color: '#D9C8A3',
                letterSpacing: '0.15em',
              }}
            >
              AKASH PG · AI SYSTEM ARCHITECT
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
